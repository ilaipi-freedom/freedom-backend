import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prisma } from '@prisma/client';

import { CustomerRemark } from 'src/database/entities/customer-remark.entity';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CustomerRemarkService {
  constructor(
    @InjectRepository(CustomerRemark)
    private readonly customerRemarkRepository: Repository<CustomerRemark>,
    private readonly prisma: PrismaService,
  ) {}

  async list(customerId: string) {
    const where: Prisma.CustomerRemarkWhereInput = {
      customerId,
    };
    const list = await this.prisma.customerRemark.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
