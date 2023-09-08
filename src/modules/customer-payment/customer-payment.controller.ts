import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CustomerPaymentService } from './customer-payment.service';

@Controller('customer-payment')
export class CustomerPaymentController {
  constructor(
    private readonly customerPaymentService: CustomerPaymentService,
  ) {}
  @Get('/list')
  async list(@Query('customerId') customerId: string) {
    return this.customerPaymentService.list(customerId);
  }

  @Post()
  async create(@Body() payload: Prisma.CustomerPaymentCreateInput) {
    return this.customerPaymentService.create(payload);
  }

  @Put('/:id')
  async update(@Body() payload: Prisma.CustomerPaymentUpdateInput) {
    return this.customerPaymentService.update(payload);
  }

  @Get('/sumAmountByMonth')
  async sumAmountByMonth() {
    return this.customerPaymentService.sumAmountByMonth();
  }
}
