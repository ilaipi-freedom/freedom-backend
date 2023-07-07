import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { CustomerService } from './customer.service';
import { Customer } from 'src/database/entities/customer.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @Get('/list')
  async list() {
    return this.customerService.list();
  }
  @Get('/:id')
  async detail(@Param('id') id: string) {
    return this.customerService.detail(id);
  }

  @Post()
  async create(@Body() payload: Customer) {
    return this.customerService.create(payload);
  }

  @Put('/:id')
  async update(@Body() payload: Customer) {
    return this.customerService.update(payload);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.customerService.upload(file);
  }
}
