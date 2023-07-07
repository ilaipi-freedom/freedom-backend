import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './config/';
import { MysqlModule } from './database/mysql.module';

import { CustomerModule } from './modules/customer/customer.module';
import { CustomerRemarkModule } from './modules/customer-remark/customer-remark.module';
import { CustomerOrderModule } from './modules/customer-order/customer-order.module';
import { CustomerPaymentModule } from './modules/customer-payment/customer-payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MysqlModule,
    CustomerModule,
    CustomerRemarkModule,
    CustomerOrderModule,
    CustomerPaymentModule,
  ],
})
export class AppModule {}
