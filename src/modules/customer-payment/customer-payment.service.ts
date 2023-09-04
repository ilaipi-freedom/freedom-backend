import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { reverse } from 'lodash';
import { Prisma } from '@prisma/client';

import { formatISO } from 'src/common/date-helper';
import { CustomerPayment } from 'src/database/entities/customer-payment.entity';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CustomerPaymentService {
  constructor(
    @InjectRepository(CustomerPayment)
    private readonly customerPaymentRepository: Repository<CustomerPayment>,
    private readonly prisma: PrismaService,
  ) {}

  async list(customerId: string) {
    const where: Prisma.CustomerPaymentWhereInput = {
      customerId,
    };
    const list = await this.prisma.customerPayment.findMany({
      where,
      orderBy: { payTime: 'desc' },
    });
    type TypeOut =
      | {
          payTime?: string;
        }
      | CustomerPayment;
    const result: TypeOut[] = [];
    for (const { payTime, ...others } of list) {
      const row: TypeOut = {
        ...others,
        payTime: undefined,
      };
      row.payTime = formatISO(payTime);
      result.push(row);
    }
    return list;
  }

  async update(payload: Partial<CustomerPayment>) {
    return this.prisma.customerPayment.update({
      where: { id: payload.id },
      data: payload,
    });
  }

  async create(data: Prisma.CustomerPaymentCreateInput) {
    return this.prisma.customerPayment.create({ data });
  }

  async sumAmountByMonth() {
    const qb = this.customerPaymentRepository.createQueryBuilder('payment');
    const result = await qb
      .select("DATE_FORMAT(payment.payTime, '%Y-%m')", 'month')
      .addSelect('SUM(payment.amount)', 'totalAmount')
      .groupBy('month')
      .orderBy('month', 'DESC')
      .limit(12)
      .getRawMany();
    return reverse(result);
  }
}
