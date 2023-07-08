import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './config/';
import { MysqlModule } from './database/mysql.module';

import { CustomerModule } from './modules/customer/customer.module';
import { CustomerRemarkModule } from './modules/customer-remark/customer-remark.module';
import { CustomerOrderModule } from './modules/customer-order/customer-order.module';
import { CustomerPaymentModule } from './modules/customer-payment/customer-payment.module';
import { CustomerProjectModule } from './modules/customer-project/customer-project.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MysqlModule,
    CustomerModule,
    CustomerRemarkModule,
    CustomerOrderModule,
    CustomerPaymentModule,
    CustomerProjectModule,
    AuthModule,
    AccountModule,
  ],
})
export class AppModule {}
