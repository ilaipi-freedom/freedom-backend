import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import config from './config/';
import { MysqlModule } from './database/mysql.module';

import { CustomerModule } from './modules/customer/customer.module';
import { CustomerRemarkModule } from './modules/customer-remark/customer-remark.module';
import { CustomerOrderModule } from './modules/customer-order/customer-order.module';
import { CustomerPaymentModule } from './modules/customer-payment/customer-payment.module';
import { CustomerProjectModule } from './modules/customer-project/customer-project.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { JwtAuthGuard } from './modules/auth/auth.guard';
import { CacheModule } from './modules/cache/cache.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { SysDictModule } from './modules/sys-dict/sys-dict.module';
import { SysDictDataModule } from './modules/sys-dict-data/sys-dict-data.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule,
    CacheModule,
    MysqlModule,
    CustomerModule,
    CustomerRemarkModule,
    CustomerOrderModule,
    CustomerPaymentModule,
    CustomerProjectModule,
    AuthModule,
    AccountModule,
    RoleModule,
    SysDictModule,
    SysDictDataModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
