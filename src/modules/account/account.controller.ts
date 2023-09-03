import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AvailableStatus, Prisma } from '@prisma/client';

import { AccountService } from './account.service';
import { ResetPasswordDto } from './dto';
import { CurrentUser } from 'src/common/current-user';
import { AuthSession } from 'src/types/Auth';
import { AuthHelper } from 'src/common/auth-helper';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get('/info')
  async info(@CurrentUser() user: AuthSession) {
    return user;
  }
  @Post()
  async createAccount(@Body() payload: Prisma.AccountCreateInput) {
    return this.accountService.create(payload);
  }
  @Put(':id')
  async updateAccount(
    @Param('id') id: string,
    @Body() payload: Prisma.AccountCreateInput,
  ) {
    return this.accountService.update(id, payload);
  }
  @Put('resetPassword/:id')
  async resetPassword(
    @CurrentUser() user: AuthSession,
    @Param('id') id: string,
    @Body() payload: ResetPasswordDto,
  ) {
    if (!AuthHelper.isAdmin(user)) {
      throw new HttpException('仅管理员可以重置密码', HttpStatus.FORBIDDEN);
    }
    return this.accountService.resetPassword(id, payload);
  }

  @Get()
  async list(
    @Query('q') q: string,
    @Query('status') status: AvailableStatus,
    @Query('date') date: string[],
    @Query('current') page = 1,
    @Query('pageSize') limit = 30,
  ) {
    return this.accountService.list({ q, status, date }, page, limit);
  }
  @Delete()
  async deleteAccount(@Param('id') id: string) {
    return this.accountService.remove(id);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.accountService.getById(id);
  }
}
