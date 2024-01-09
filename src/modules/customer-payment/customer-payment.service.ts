import { Injectable } from '@nestjs/common';
import { CustomerPayment, Prisma } from '@prisma/client';
import { reverse } from 'lodash';

import { formatISO, utc } from 'src/common/date-helper';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CustomerPaymentService {
  constructor(private readonly prisma: PrismaService) {}

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

  async update(payload: Prisma.CustomerPaymentUpdateInput) {
    return this.prisma.customerPayment.update({
      where: { id: payload.id as string },
      data: {
        ...payload,
        payTime: utc(payload.payTime as string),
      },
    });
  }

  async create(data: Prisma.CustomerPaymentCreateInput) {
    return this.prisma.customerPayment.create({
      data: {
        ...data,
        payTime: utc(data.payTime as string),
      },
    });
  }

  async sumAmountByMonth() {
    const result = await this.prisma.$queryRaw`
      select DATE_FORMAT(payTime, '%Y-%m') as month, SUM(amount) as totalAmount
      from customer_payment
      group by month
      order by month desc
      limit 12
    `;
    return reverse(result as []);
  }
}
