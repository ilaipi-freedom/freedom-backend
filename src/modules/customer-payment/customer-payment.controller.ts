import { Body, Controller, Get, Post, Put } from '@nestjs/common';

import { CustomerPayment } from 'src/database/entities/customer-payment.entity';
import { CustomerPaymentService } from './customer-payment.service';

@Controller('customer-payment')
export class CustomerPaymentController {
  constructor(
    private readonly customerPaymentService: CustomerPaymentService,
  ) {}
  @Get('/list')
  async list() {
    return this.customerPaymentService.list();
  }

  @Post()
  async create(@Body() payload: CustomerPayment) {
    return this.customerPaymentService.create(payload);
  }

  @Put('/:id')
  async update(@Body() payload: CustomerPayment) {
    return this.customerPaymentService.update(payload);
  }
}
