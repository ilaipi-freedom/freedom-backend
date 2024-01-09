import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

import { CustomerPaymentService } from './customer-payment.service';

@Controller('customer-payment')
export class CustomerPaymentController {
  constructor(
    private readonly customerPaymentService: CustomerPaymentService,
  ) {}

  @Get('/list')
  @ApiQuery({
    name: 'customerId',
  })
  @ApiQuery({
    name: 'q',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: [String],
    description: '支付时间',
  })
  @ApiQuery({
    name: 'isAll',
    required: false,
    type: Boolean,
    description: '是否获取全部',
  })
  @ApiQuery({
    name: 'current',
    required: false,
    type: Number,
    description: '当前页，从1开始',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: '每页数量',
  })
  async list(
    @Query('q') q: string,
    @Query('customerId') customerId: string,
    @Query('date') date: string[],
    @Query('isAll') isAll: boolean,
    @Query('current') page: number,
    @Query('pageSize') limit: number,
  ) {
    return this.customerPaymentService.list(
      q,
      customerId,
      date,
      isAll,
      page,
      limit,
    );
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
