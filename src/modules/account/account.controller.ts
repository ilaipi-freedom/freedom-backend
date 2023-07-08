import { Controller, Get } from '@nestjs/common';

import { CurrentUser } from 'src/common/current-user';
import { Account } from 'src/database/entities/account.entity';

@Controller('account')
export class AccountController {
  @Get('info')
  async profile(@CurrentUser() user: Partial<Account>) {
    return user;
  }
}
