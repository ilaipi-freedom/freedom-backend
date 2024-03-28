import { Injectable } from '@nestjs/common';
import { CustomerPayment, Prisma } from '@prisma/client';
import { reverse, unset } from 'lodash';

import { dateWhereAnd, fmtBy, formatISO, utc } from 'src/common/date-helper';
import { pageOptions } from 'src/common/page-helper';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CustomerPaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    q: string,
    customerId: string,
    date: string[],
    isAll: boolean,
    page: number,
    limit: number,
  ) {
    const dateWhere = dateWhereAnd(date, 'payTime');
    const where: Prisma.CustomerPaymentWhereInput = {
      ...(customerId ? { customerId } : {}),
      ...(dateWhere ? { AND: dateWhere } : {}),
    };
    if (q) {
      where.customer = {
        OR: [
          { name: { contains: q } },
          { weixin: { contains: q } },
          { weixinId: { contains: q } },
          { xianyu: { contains: q } },
          { qq: { contains: q } },
          { qqNum: { contains: q } },
          { phone: { contains: q } },
        ],
      };
    }
    const list = await this.prisma.customerPayment.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            weixin: true,
            weixinId: true,
            xianyu: true,
            qq: true,
            qqNum: true,
            phone: true,
          },
        },
      },
      where,
      orderBy: { payTime: 'desc' },
      ...pageOptions(page, limit, isAll),
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
    if (isAll) {
      return list;
    }
    const total = await this.prisma.customerPayment.count({ where });
    if (!list.length) {
      return { list, total };
    }
    return {
      list: list.map((row: CustomerPayment) => ({
        ...row,
        payTime: fmtBy(row.payTime, 'yyyy-MM-dd HH:mm'),
      })),
      total,
    };
  }

  async update(payload: Prisma.CustomerPaymentUpdateInput) {
    unset(payload, 'customer');
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
