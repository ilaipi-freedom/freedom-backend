import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from '../account/account.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const account = await this.accountService.findByUsername(username);
    if (!account) {
      console.log('======用户不存在，登录失败======', username);
      return new UnauthorizedException('登录失败!');
    }
    if (await argon2.verify(account.password, pass)) {
      const payload = { role: account.role, username: account.username };
      return {
        token: await this.jwtService.signAsync(payload),
      };
    } else {
      console.log('======密码错误，登录失败======', username);
      return new UnauthorizedException('登录失败!');
    }
  }
}
