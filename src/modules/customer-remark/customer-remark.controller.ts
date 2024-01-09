import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CustomerRemarkService } from './customer-remark.service';

@Controller('customer-remark')
export class CustomerRemarkController {
  constructor(private readonly customerRemarkService: CustomerRemarkService) {}
  @Get('/list')
  async list(@Query('customerId') customerId: string) {
    return this.customerRemarkService.list(customerId);
  }

  @Post()
  async create(@Body() payload: Prisma.CustomerRemarkCreateInput) {
    return this.customerRemarkService.create(payload);
  }

  @Put('/:id')
  async update(@Body() payload: Prisma.CustomerRemarkUpdateInput) {
    return this.customerRemarkService.update(payload);
  }
}
