import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { formatISO } from 'src/common/date-helper';
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
    type TypeOut =
      | {
          begin?: string;
          end?: string;
        }
      | CustomerProject;
    const result: TypeOut[] = [];
    for (const { begin, end, ...others } of list) {
      const row: TypeOut = {
        ...others,
        begin: undefined,
        end: undefined,
      };
      row.begin = formatISO(begin);
      row.end = formatISO(end);
      result.push(row);
    }
    return list;
  }

  async update(payload: Partial<CustomerProject>) {
    return await this.customerProjectRepository.save(payload);
  }

  async create(payload: Partial<CustomerProject>) {
    return await this.customerProjectRepository.save(payload);
  }
}
