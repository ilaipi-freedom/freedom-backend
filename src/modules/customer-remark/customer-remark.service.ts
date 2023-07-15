import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerRemark } from 'src/database/entities/customer-remark.entity';

@Injectable()
export class CustomerRemarkService {
  constructor(
    @InjectRepository(CustomerRemark)
    private readonly customerRemarkRepository: Repository<CustomerRemark>,
  ) {}

  async list(customerId: string) {
    const list = await this.customerRemarkRepository.find({
      where: { customer: { id: customerId } },
      order: { createdAt: 'desc' },
    });
    return list;
  }

  async update(payload: Partial<CustomerRemark>) {
    return await this.customerRemarkRepository.save(payload);
  }

  async create(payload: Partial<CustomerRemark>) {
    return await this.customerRemarkRepository.save(payload);
  }
}
