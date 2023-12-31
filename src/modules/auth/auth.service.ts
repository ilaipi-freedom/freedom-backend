import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

import { AuthHelper } from 'src/common/auth-helper';
import { AuthSession, AuthSessionKey } from 'src/types/Auth';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async verifyAccount(username: string, pass: string) {
    const account = await this.prisma.account.findUnique({
      where: {
        username,
      },
      include: {
        role: true,
      },
    });
    if (!account) {
      console.log('======用户不存在，登录失败======', username);
      throw new UnauthorizedException('登录失败!');
    }
    if (await argon2.verify(account.password, pass)) {
      return account;
    } else {
      console.log('======密码错误，登录失败======', username);
      throw new UnauthorizedException('登录失败!');
    }
  }

  async signIn(username: string, pass: string) {
    const account = await this.verifyAccount(username, pass);
    const type = await this.configService.get('env.appInstance');
    const payload = { id: account.id, key: 'AUTH', type };
    const sessionKey = AuthHelper.sessionKey(payload);
    const token = await this.jwtService.signAsync(payload);
    const sessionParam = {
      id: account.id,
      username: account.username,
      token,
      role: account.role.perm,
    };
    await this.cacheManager.set(sessionKey, JSON.stringify(sessionParam), 0);
    return {
      id: account.id,
      role: account.role.perm,
      token,
    };
  }

  async signOut(payload: AuthSession) {
    const sessionKeyParam = { id: payload.id, key: 'AUTH', type: 'ADMIN' };
    const sessionKey = AuthHelper.sessionKey(sessionKeyParam);
    await this.cacheManager.del(sessionKey);
  }

  async validateUser(payload: AuthSessionKey) {
    const sessionKey = AuthHelper.sessionKey(payload);
    const session = await this.cacheManager.get(sessionKey);
    if (session) {
      return JSON.parse(session as string);
    }
    throw new UnauthorizedException('登录已失效!');
  }
}
