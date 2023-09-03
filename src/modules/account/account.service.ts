import { Injectable } from '@nestjs/common';
import { AvailableStatus, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../../database/prisma/prisma.service';
import { ResetPasswordDto } from './dto';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AccountCreateInput) {
    const password = await argon2.hash(data.password);
    return this.prisma.account.create({ data: { ...data, password } });
  }

  async resetPassword(id: string, payload: ResetPasswordDto) {
    const password = await argon2.hash(payload.password);
    return this.prisma.account.update({
      where: { id },
      data: { password },
      select: {
        id: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.account.delete({ where: { id } });
  }

  async update(id: string, data: Prisma.AccountCreateInput) {
    return this.prisma.account.update({
      where: { id },
      data,
      select: {
        id: true,
      },
    });
  }
  async list(
    query: {
      q?: string;
      status?: AvailableStatus;
      date?: string[];
    },
    page = 1,
    limit = 30,
  ) {
    const where: Prisma.AccountWhereInput = {};
    if (query.q) {
      where.username = { contains: query.q };
    }
    const total = await this.prisma.account.count({ where });
    const list = await this.prisma.account.findMany({
      where,
      select: {
        id: true,
        username: true,
        roleId: true,
      },
      skip: (page - 1) * limit,
      take: Number(limit),
    });
    return { total, list };
  }

  async getById(id: string) {
    const result = await this.prisma.account.findUnique({
      where: { id },
      select: {
        id: true,
        roleId: true,
        username: true,
      },
    });
    return result;
  }
}
