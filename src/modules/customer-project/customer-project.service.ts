import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerProject } from 'src/database/entities/customer-project.entity';

@Injectable()
export class CustomerProjectService {
  constructor(
    @InjectRepository(CustomerProject)
    private readonly customerProjectRepository: Repository<CustomerProject>,
  ) {}

  async list(customerId: string) {
    const list = await this.customerProjectRepository.find({
      where: { customer: { id: customerId } },
    });
    return list;
  }

  async update(payload: Partial<CustomerProject>) {
    return await this.customerProjectRepository.save(payload);
  }

  async create(payload: Partial<CustomerProject>) {
    return await this.customerProjectRepository.save(payload);
  }
}
