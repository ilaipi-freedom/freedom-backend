import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from './entities/customer.entity';
import { CustomerRemark } from './entities/customer-remark.entity';
import { Account } from './entities/account.entity';
import { CustomerOrder } from './entities/customer-order.entity';
import { CustomerPayment } from './entities/customer-payment.entity';
import { CustomerProject } from './entities/customer-project.entity';

const entities = [
  Account,
  Customer,
  CustomerRemark,
  CustomerOrder,
  CustomerPayment,
  CustomerProject,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('env.mysql'),
        autoLoadEntities: true,
        // synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class MysqlModule {}
