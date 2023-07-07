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

  async list(customerId: string) {
    const list = await this.customerOrderRepository.find({
      where: { customer: { id: customerId } },
    });
    return list;
  }

  async update(payload: Partial<CustomerOrder>) {
    return await this.customerOrderRepository.save(payload);
  }

  async create(payload: Partial<CustomerOrder>) {
    return await this.customerOrderRepository.save(payload);
  }
}
