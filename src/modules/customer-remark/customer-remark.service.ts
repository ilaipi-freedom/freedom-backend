import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CustomerRemarkService {
  constructor(private readonly prisma: PrismaService) {}

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

  async update(payload: Prisma.CustomerRemarkUpdateInput) {
    return this.prisma.customerRemark.update({
      where: { id: payload.id as string },
      data: payload,
    });
  }

  async create(data: Prisma.CustomerRemarkCreateInput) {
    return this.prisma.customerRemark.create({ data });
  }
}
