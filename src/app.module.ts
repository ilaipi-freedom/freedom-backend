import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';

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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CacheModule,
    MysqlModule,
    CustomerModule,
    CustomerRemarkModule,
    CustomerOrderModule,
    CustomerPaymentModule,
    CustomerProjectModule,
    AuthModule,
    AccountModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
