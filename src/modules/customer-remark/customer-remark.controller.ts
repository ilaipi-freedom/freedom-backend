import { Body, Controller, Get, Post, Put } from '@nestjs/common';

import { CustomerRemarkService } from './customer-remark.service';
import { CustomerRemark } from 'src/database/entities/customer-remark.entity';

@Controller('customer-remark')
export class CustomerRemarkController {
  constructor(private readonly customerRemarkService: CustomerRemarkService) {}
  @Get('/list')
  async list() {
    return this.customerRemarkService.list();
  }

  @Post()
  async create(@Body() payload: CustomerRemark) {
    return this.customerRemarkService.create(payload);
  }

  @Put('/:id')
  async update(@Body() payload: CustomerRemark) {
    return this.customerRemarkService.update(payload);
  }
}
