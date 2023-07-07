import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerOrder } from 'src/database/entities/customer-order.entity';

@Injectable()
export class CustomerOrderService {
  constructor(
    @InjectRepository(CustomerOrder)
    private readonly customerOrderRepository: Repository<CustomerOrder>,
  ) {}

  async list() {
    const list = await this.customerOrderRepository.find();
    return list;
  }

  async update(payload: Partial<CustomerOrder>) {
    return await this.customerOrderRepository.save(payload);
  }

  async create(payload: Partial<CustomerOrder>) {
    return await this.customerOrderRepository.save(payload);
  }
}
