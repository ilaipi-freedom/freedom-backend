import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { formatISO } from 'src/common/date-helper';
import { CustomerOrder } from 'src/database/entities/customer-order.entity';

@Injectable()
export class CustomerOrderService {
  constructor(
    @InjectRepository(CustomerOrder)
    private readonly customerOrderRepository: Repository<CustomerOrder>,
  ) {}

  async list(customerId: string) {
    const list = await this.customerOrderRepository.find({
      where: { customer: { id: customerId } },
      order: { deliveryTime: 'desc' },
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

  async update(payload: Partial<CustomerOrder>) {
    return await this.customerOrderRepository.save(payload);
  }

  async create(payload: Partial<CustomerOrder>) {
    return await this.customerOrderRepository.save(payload);
  }
}
