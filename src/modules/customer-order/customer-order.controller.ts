import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';

import { CustomerOrder } from 'src/database/entities/customer-order.entity';
import { CustomerOrderService } from './customer-order.service';

@Controller('customer-order')
export class CustomerOrderController {
  constructor(private readonly customerOrderService: CustomerOrderService) {}
  @Get('/list')
  async list(@Query('customerId') customerId: string) {
    return this.customerOrderService.list(customerId);
  }

  @Post()
  async create(@Body() payload: CustomerOrder) {
    return this.customerOrderService.create(payload);
  }

  @Put('/:id')
  async update(@Body() payload: CustomerOrder) {
    return this.customerOrderService.update(payload);
  }
}
