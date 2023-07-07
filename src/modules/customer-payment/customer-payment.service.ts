import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerPayment } from 'src/database/entities/customer-payment.entity';

@Injectable()
export class CustomerPaymentService {
  constructor(
    @InjectRepository(CustomerPayment)
    private readonly customerPaymentRepository: Repository<CustomerPayment>,
  ) {}

  async list() {
    const list = await this.customerPaymentRepository.find();
    return list;
  }

  async update(payload: Partial<CustomerPayment>) {
    return await this.customerPaymentRepository.save(payload);
  }

  async create(payload: Partial<CustomerPayment>) {
    return await this.customerPaymentRepository.save(payload);
  }
}
