import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { unset } from 'lodash';

import { formatISO, utc } from 'src/common/date-helper';
import { CustomerOrder } from 'src/database/entities/customer-order.entity';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CustomerOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async list(customerId: string) {
    const where: Prisma.CustomerOrderWhereInput = {
      customerId,
    };
    const list = await this.prisma.customerOrder.findMany({
      where,
      orderBy: { deliveryTime: 'desc' },
    });
    type TypeOut =
      | {
          orderTime?: string;
          deliveryTime?: string;
          firstMessageTime?: string;
        }
      | CustomerOrder;
    const result: TypeOut[] = [];
    for (const {
      orderTime,
      deliveryTime,
      firstMessageTime,
      ...others
    } of list) {
      unset(others, 'createdAt');
      unset(others, 'updatedAt');
      unset(others, 'accountId');
      const row: TypeOut = {
        ...others,
        orderTime: undefined,
        deliveryTime: undefined,
        firstMessageTime: undefined,
      };
      row.firstMessageTime = formatISO(firstMessageTime);
      row.deliveryTime = formatISO(deliveryTime);
      row.orderTime = formatISO(orderTime);
      result.push(row);
    }
    return result;
  }

  async update(payload: Prisma.CustomerOrderUpdateInput) {
    return this.prisma.customerOrder.update({
      where: { id: payload.id as string },
      data: {
        ...payload,
        status: Number(payload.status),
        firstMessageTime: utc(payload.firstMessageTime as string),
        orderTime: utc(payload.orderTime as string),
        deliveryTime: utc(payload.deliveryTime as string),
      },
    });
  }

  async create(data: Prisma.CustomerOrderCreateInput) {
    return this.prisma.customerOrder.create({
      data: {
        ...data,
        status: Number(data.status),
        firstMessageTime: utc(data.firstMessageTime as string),
        orderTime: utc(data.orderTime as string),
        deliveryTime: utc(data.deliveryTime as string),
      },
    });
  }
}
