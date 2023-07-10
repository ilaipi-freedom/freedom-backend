import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { AccountService } from '../account/account.service';
import { Account } from 'src/database/entities/account.entity';
import { AuthHelper } from 'src/common/auth-helper';
import { AdminAuthSession, AuthSessionKey } from 'src/types/Auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async verifyAccount(username: string, pass: string) {
    const account = await this.accountService.findByUsername(username);
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
    const payload = { id: account.id, key: 'AUTH', type: 'ADMIN' };
    const sessionKey = AuthHelper.sessionKey(payload);
    const token = await this.jwtService.signAsync(payload);
    const sessionParam = {
      id: account.id,
      username: account.username,
      token,
      role: account.role,
    };
    await this.cacheManager.set(sessionKey, JSON.stringify(sessionParam), 0);
    return {
      token,
    };
  }

  async signOut(payload: AdminAuthSession) {
    const sessionKeyParam = { id: payload.id, key: 'AUTH', type: 'ADMIN' };
    const sessionKey = AuthHelper.sessionKey(sessionKeyParam);
    await this.cacheManager.del(sessionKey);
  }

  async validateUser(payload: AuthSessionKey): Promise<Partial<Account>> {
    const sessionKey = AuthHelper.sessionKey(payload);
    console.log('===========sessionKey 1', sessionKey);
    const session = await this.cacheManager.get(sessionKey);
    console.log('===========session', session);
    if (session) {
      return JSON.parse(session as string);
    }
    throw new UnauthorizedException('登录已失效!');
  }
}
