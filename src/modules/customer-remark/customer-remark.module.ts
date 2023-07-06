import { Module } from '@nestjs/common';
import { CustomerRemarkController } from './customer-remark.controller';
import { CustomerRemarkService } from './customer-remark.service';

@Module({
  controllers: [CustomerRemarkController],
  providers: [CustomerRemarkService]
})
export class CustomerRemarkModule {}
