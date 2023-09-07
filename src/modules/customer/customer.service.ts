import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import xlsx from 'node-xlsx';
import { keyBy } from 'lodash';
import { addDays, addMilliseconds, subHours, subMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Prisma } from '@prisma/client';

import { formatISO, utc } from 'src/common/date-helper';
import { Customer } from 'src/database/entities/customer.entity';
import { CustomerOrder } from 'src/database/entities/customer-order.entity';
import { OrderStatus } from 'src/types/OrderType';
import { CustomerPayment } from 'src/database/entities/customer-payment.entity';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AuthSession } from 'src/types/Auth';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerOrder)
    private readonly customerOrderRepository: Repository<CustomerOrder>,
    @InjectRepository(CustomerPayment)
    private readonly customerPaymentRepository: Repository<CustomerPayment>,
    private readonly prisma: PrismaService,
  ) {}
  async list({ q, firstMessageTime, current, pageSize }) {
    const where: Prisma.CustomerWhereInput = {};
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { weixin: { contains: q } },
        { weixinId: { contains: q } },
        { xianyu: { contains: q } },
        { qq: { contains: q } },
      ];
    }
    if (firstMessageTime && firstMessageTime[0] && firstMessageTime[1]) {
      where.AND = [
        { firstMessageTime: { gte: firstMessageTime[0] } },
        { firstMessageTime: { lt: firstMessageTime[1] } },
      ];
    }
    type TypeOut =
      | {
          firstMessageTime?: string;
        }
      | Customer;
    const result: TypeOut[] = [];
    const total = await this.prisma.customer.count({ where });
    const list = await this.prisma.customer.findMany({
      where,
      orderBy: { firstMessageTime: 'desc' },
      take: Number(pageSize),
      skip: (Number(current) - 1) * Number(pageSize),
    });
    for (const { firstMessageTime, ...others } of list) {
      const row: TypeOut = {
        ...others,
        firstMessageTime: undefined,
      };
      row.firstMessageTime = formatISO(firstMessageTime);
      result.push(row);
    }
    return { list: result, total };
  }

  async detail(id: string) {
    const customer = await this.customerRepository.findOneBy({ id });
    const { firstMessageTime, ...others } = customer;
    const row: Customer | { firstMessageTime?: string } = {
      ...others,
      firstMessageTime: undefined,
    };
    row.firstMessageTime = formatISO(firstMessageTime);
    return row;
  }

  async update(payload: Partial<Customer>) {
    return this.prisma.customer.update({
      where: { id: payload.id },
      data: payload,
    });
  }

  async create(user: AuthSession, data: Prisma.CustomerCreateInput) {
    return this.prisma.customer.create({
      data: {
        ...data,
        accountId: user.id,
        firstMessageTime: utc(data.firstMessageTime as string),
      },
    });
  }

  async staticticsNums() {
    const totalCustomers = await this.customerRepository.count();
    const { paidCustomers } = await this.customerPaymentRepository
      .createQueryBuilder('payment')
      .select('count(DISTINCT(customerId))', 'paidCustomers')
      .getRawOne();
    const totalPaid = await this.customerPaymentRepository.sum('amount');
    const deliveryOrders = await this.customerOrderRepository.countBy({
      status: OrderStatus.DELIVERY,
    });
    return {
      totalCustomers,
      paidCustomers: Number(paidCustomers),
      totalPaid,
      deliveryOrders,
    };
  }

  async groupByPeriod() {
    const qb = this.customerRepository.createQueryBuilder('customer');
    const result = await qb
      .select(
        `
          CASE
            WHEN HOUR(customer.firstMessageTime) >= 7 AND HOUR(customer.firstMessageTime) < 11 THEN 'A'
            WHEN HOUR(customer.firstMessageTime) >= 11 AND HOUR(customer.firstMessageTime) < 13 THEN 'B'
            WHEN HOUR(customer.firstMessageTime) >= 13 AND HOUR(customer.firstMessageTime) < 17 THEN 'C'
            WHEN HOUR(customer.firstMessageTime) >= 17 AND HOUR(customer.firstMessageTime) < 20 THEN 'D'
            WHEN HOUR(customer.firstMessageTime) >= 20 AND HOUR(customer.firstMessageTime) < 23 THEN 'E'
            ELSE 'F'
          END AS timePeriod,
          COUNT(*) as count
        `,
      )
      .groupBy('timePeriod')
      .orderBy('count', 'DESC')
      .getRawMany();
    const timePeriod = [
      'A: 7-11',
      'B: 11-13',
      'C: 13-17',
      'D: 17-20',
      'E: 20-23',
      'F: 23-6',
    ];
    return { data: result, timePeriod };
  }

  async mostPaidAmount() {
    const qb = this.customerPaymentRepository.createQueryBuilder('payment');
    const result = await qb
      .select('payment.customerId, SUM(payment.amount)', 'totalAmount')
      .addSelect('customer.weixin', 'weixin')
      .addSelect('customer.weixinId', 'weixinId')
      .addSelect('customer.xianyu', 'xianyu')
      .innerJoin(Customer, 'customer', 'payment.customerId = customer.id')
      .groupBy('payment.customerId')
      .orderBy('totalAmount', 'DESC')
      .limit(5)
      .getRawMany();
    const totalPaid = await this.customerPaymentRepository.sum('amount');
    return { top5: result, totalPaid };
  }

  async mostPaidTimes() {
    const qb = this.customerPaymentRepository.createQueryBuilder('payment');
    const result = await qb
      .select('payment.customerId, COUNT(*)', 'paymentCount')
      .addSelect('customer.weixin', 'weixin')
      .addSelect('customer.weixinId', 'weixinId')
      .addSelect('customer.xianyu', 'xianyu')
      .innerJoin(Customer, 'customer', 'payment.customerId = customer.id')
      .groupBy('payment.customerId')
      .orderBy('paymentCount', 'DESC')
      .limit(5)
      .getRawMany();
    const totalPaid = await this.customerPaymentRepository.count();
    return { top5: result, totalPaid };
  }

  async upload(file: Express.Multer.File) {
    const workSheetsFromBuffer = xlsx.parse(file.buffer, { raw: true });
    const sheets = keyBy(workSheetsFromBuffer, 'name');
    const ordersData = sheets['订单'].data;
    ordersData.shift();
    const paymentsData = sheets['收款'].data;
    paymentsData.shift();
    const customerMap = new Map<string, Partial<Customer>>();
    const orderMap = new Map<string, Partial<CustomerOrder>[]>();
    const paymentMap = new Map<string, Partial<CustomerPayment>[]>();
    for (const orderRow of ordersData) {
      if (!orderRow[0]) {
        continue;
      }
      const firstMessageTime = `${orderRow[0] + orderRow[1]}`;
      const order: Partial<CustomerOrder> = {
        firstMessageTime: this.handleTime(firstMessageTime),
        status: orderRow[2] === '是' ? OrderStatus.DELIVERY : OrderStatus.NONE,
        from: orderRow[6],
        orderTime: this.handleTime(orderRow[4]),
        deliveryTime: this.handleTime(orderRow[5]),
        industry: orderRow[9],
        industryDetail: orderRow[10],
        content: orderRow[8],
        detail: orderRow[11],
        extra: orderRow[12],
      };
      const customer = this.handleCustomer(
        orderRow[7].replace('(', '（').replace(')', '）'),
      );
      if (orderMap.has(customer.xianyu)) {
        orderMap.get(customer.xianyu).push(order);
      } else {
        orderMap.set(customer.xianyu, [order]);
        customer.firstMessageTime = order.firstMessageTime;
      }
      customerMap.set(customer.xianyu, customer);
    }
    for (const paymentRow of paymentsData) {
      if (!paymentRow[0]) {
        continue;
      }
      const customer = this.handleCustomer(
        paymentRow[3].replace('(', '（').replace(')', '）'),
      );
      const payment: Partial<CustomerPayment> = {
        payTime: this.handleTime(paymentRow[0]),
        payMethod: paymentRow[1],
        amount: Number(paymentRow[2]),
        extra: paymentRow[5],
      };
      if (paymentMap.has(customer.xianyu)) {
        paymentMap.get(customer.xianyu).push(payment);
      } else {
        paymentMap.set(customer.xianyu, [payment]);
      }
    }
    for (const customer of customerMap.values()) {
      const created = await this.customerRepository.save(customer);
      if (orderMap.has(customer.xianyu)) {
        await this.customerOrderRepository.save(
          orderMap
            .get(customer.xianyu)
            .map((order) => ({ ...order, customer: created })),
        );
      }
      if (paymentMap.has(customer.xianyu)) {
        await this.customerPaymentRepository.save(
          paymentMap
            .get(customer.xianyu)
            .map((payment) => ({ ...payment, customer: created })),
        );
      }
    }
  }

  handleCustomer(str: string): Partial<Customer> {
    const result: Partial<Customer> = {};

    const xianyuMatch: RegExpMatchArray | null = str.match(/闲鱼：(.+)/);
    if (xianyuMatch) {
      result.xianyu = xianyuMatch[1].trim();
    }

    const weixinMatch: RegExpMatchArray | null = str.match(/微信：(.+)/);
    if (weixinMatch && weixinMatch[1]) {
      const weixinParts: string[] = weixinMatch[1].split('（');
      result.weixin = weixinParts[0].trim();
      result.weixinId = weixinParts[1].replace('）', '').trim();
    }

    const qqMatch: RegExpMatchArray | null = str.match(/QQ：(.+)/);
    if (qqMatch && qqMatch[1]) {
      const qqParts: string[] = qqMatch[1].split('（');
      result.qq = qqParts[0].trim();
      result.qqNum = qqParts[1].replace('）', '').trim();
    }
    return result;
  }

  handleTime(str: string) {
    const baseDate = new Date('1899-12-30'); // Excel 中的日期序列号的基准日期

    // 提取整数部分，代表日期的序列号
    const excelDateValue = Math.floor(Number(str));

    // 将整数部分转换为 JavaScript 的日期对象
    const jsDate = addDays(baseDate, excelDateValue);

    // 提取小数部分，代表时间的小数部分
    const excelTimeValue = Number(str) - excelDateValue;

    // 将小数部分转换为毫秒数，乘以 24 小时、60 分钟和 60 秒的系数
    const timeInMilliseconds = excelTimeValue * 24 * 60 * 60 * 1000;

    // 将时间的毫秒数添加到 JavaScript 的日期对象中，获得包含日期和时间的完整日期对象
    const completeDate = subMinutes(
      addMilliseconds(jsDate, timeInMilliseconds),
      5,
    );

    const timeZone = 'Asia/Shanghai'; // 设置为东八区的时区
    const zonedDate = utcToZonedTime(subHours(completeDate, 8), timeZone);
    return zonedDate;
  }
}
