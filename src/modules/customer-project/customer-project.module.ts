import { Module } from '@nestjs/common';

import { CustomerProjectController } from './customer-project.controller';
import { CustomerProjectService } from './customer-project.service';

@Module({
  controllers: [CustomerProjectController],
  providers: [CustomerProjectService],
})
export class CustomerProjectModule {}
