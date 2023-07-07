import { Module } from '@nestjs/common';

import { CustomerOrderController } from './customer-order.controller';
import { CustomerOrderService } from './customer-order.service';

@Module({
  controllers: [CustomerOrderController],
  providers: [CustomerOrderService],
})
export class CustomerOrderModule {}
