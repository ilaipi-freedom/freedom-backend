import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { formatISO } from 'src/common/date-helper';
import { CustomerPayment } from 'src/database/entities/customer-payment.entity';
import { reverse } from 'lodash';

@Injectable()
export class CustomerPaymentService {
  constructor(
    @InjectRepository(CustomerPayment)
    private readonly customerPaymentRepository: Repository<CustomerPayment>,
  ) {}

  async list(customerId: string) {
    const list = await this.customerPaymentRepository.find({
      where: { customer: { id: customerId } },
      order: { payTime: 'desc' },
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
    return await this.customerPaymentRepository.save(payload);
  }

  async create(payload: Partial<CustomerPayment>) {
    return await this.customerPaymentRepository.save(payload);
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
