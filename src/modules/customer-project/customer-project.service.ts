import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prisma } from '@prisma/client';

import { formatISO } from 'src/common/date-helper';
import { CustomerProject } from 'src/database/entities/customer-project.entity';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CustomerProjectService {
  constructor(
    @InjectRepository(CustomerProject)
    private readonly customerProjectRepository: Repository<CustomerProject>,
    private readonly prisma: PrismaService,
  ) {}

  async list(customerId: string) {
    const where: Prisma.CustomerProjectWhereInput = {
      customerId,
    };
    const list = await this.prisma.customerProject.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
