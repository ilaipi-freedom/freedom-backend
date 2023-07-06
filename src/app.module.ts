import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './config/';
import { MysqlModule } from './database/mysql.module';

import { CustomerModule } from './modules/customer/customer.module';
import { CustomerRemarkModule } from './modules/customer-remark/customer-remark.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MysqlModule,
    CustomerModule,
    CustomerRemarkModule,
  ],
})
export class AppModule {}
