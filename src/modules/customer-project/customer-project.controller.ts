import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CustomerProjectService } from './customer-project.service';
import { CustomerProject } from 'src/database/entities/customer-project.entity';

@Controller('customer-project')
export class CustomerProjectController {
  constructor(
    private readonly customerProjectService: CustomerProjectService,
  ) {}
  @Get('/list')
  async list(@Query('customerId') customerId: string) {
    return this.customerProjectService.list(customerId);
  }

  @Post()
  async create(@Body() payload: Prisma.CustomerProjectCreateInput) {
    return this.customerProjectService.create(payload);
  }

  @Put('/:id')
  async update(@Body() payload: CustomerProject) {
    return this.customerProjectService.update(payload);
  }
}
