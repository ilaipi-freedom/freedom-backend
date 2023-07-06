import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from 'src/database/entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customeRepository: Repository<Customer>,
  ) {}
  async list() {
    const [list, total] = await this.customeRepository.findAndCount();
    return { list, total };
  }

  async detail(id: string) {
    const customer = await this.customeRepository.findOneBy({ id });
    return customer;
  }

  async update(payload: Partial<Customer>) {
    return await this.customeRepository.save(payload);
  }

  async create(payload: Partial<Customer>) {
    return await this.customeRepository.save(payload);
  }
}
