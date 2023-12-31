import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { formatISO, utc } from 'src/common/date-helper';
import { CustomerProject } from 'src/database/entities/customer-project.entity';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CustomerProjectService {
  constructor(private readonly prisma: PrismaService) {}

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

  async update(payload: Prisma.CustomerProjectUpdateInput) {
    return this.prisma.customerProject.update({
      where: { id: payload.id as string },
      data: {
        ...payload,
        begin: utc(payload.begin as string),
        end: utc(payload.end as string),
      },
    });
  }

  async create(data: Prisma.CustomerProjectCreateInput) {
    return this.prisma.customerProject.create({
      data: {
        ...data,
        begin: utc(data.begin as string),
        end: utc(data.end as string),
      },
    });
  }
}
