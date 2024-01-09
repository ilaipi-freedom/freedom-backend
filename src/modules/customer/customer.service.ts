import { Injectable } from '@nestjs/common';
import xlsx from 'node-xlsx';
import { keyBy, map, merge, unset } from 'lodash';
import { addDays, addMilliseconds, subHours, subMinutes } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Customer, Prisma } from '@prisma/client';

import { formatISO, utc } from 'src/common/date-helper';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AuthSession } from 'src/types/Auth';
import { OrderStatus } from 'src/types/OrderType';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}
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
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    const { firstMessageTime, ...others } = customer;
    unset(others, 'createdAt');
    unset(others, 'updatedAt');
    const row: Customer | { firstMessageTime?: string } = {
      ...others,
      firstMessageTime: undefined,
    };
    row.firstMessageTime = formatISO(firstMessageTime);
    return row;
  }

  async update(payload: Prisma.CustomerUpdateInput) {
    return this.prisma.customer.update({
      where: { id: payload.id as string },
      data: {
        ...payload,
        firstMessageTime: utc(payload.firstMessageTime as string),
      },
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
    const totalCustomers = await this.prisma.customer.count();
    const paidCustomers = await this.prisma.customerPayment.findMany({
      distinct: ['customerId'],
      select: { customerId: true },
    });
    // const totalPaid = await this.customerPaymentRepository.sum('amount');
    const totalPaid = await this.prisma.customerPayment.aggregate({
      _sum: { amount: true },
    });
    const deliveryOrders = await this.prisma.customerOrder.count({
      where: { status: Number(OrderStatus.DELIVERY) },
    });
    return {
      totalCustomers,
      paidCustomers: paidCustomers.length,
      totalPaid: totalPaid._sum.amount,
      deliveryOrders,
    };
  }

  async groupByPeriod() {
    let skip = 0;
    const result = {};

    while (true) {
      const customers = await this.prisma.customer.findMany({
        take: 1000,
        skip,
      });

      if (customers.length === 0) {
        break;
      }

      customers.forEach((customer) => {
        const hour = customer.firstMessageTime.getHours();
        let timePeriod = '';

        if (hour >= 7 && hour < 11) {
          timePeriod = 'A';
        } else if (hour >= 11 && hour < 13) {
          timePeriod = 'B';
        } else if (hour >= 13 && hour < 17) {
          timePeriod = 'C';
        } else if (hour >= 17 && hour < 20) {
          timePeriod = 'D';
        } else if (hour >= 20 && hour < 23) {
          timePeriod = 'E';
        } else {
          timePeriod = 'F';
        }

        result[timePeriod] = (result[timePeriod] || 0) + 1;
      });

      skip += customers.length;
    }
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
    const result = await this.prisma.customerPayment.groupBy({
      by: ['customerId'],
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 5,
    });
    const customerIds = map(result, 'customerId');
    const customerMap: Record<string, any> = {};
    if (customerIds.length) {
      const customers = await this.prisma.customer.findMany({
        where: { id: { in: customerIds } },
        select: {
          weixin: true,
          weixinId: true,
          xianyu: true,
          id: true,
        },
      });
      merge(customerMap, keyBy(customers, 'id'));
    }
    const totalPaid = await this.prisma.customerPayment.aggregate({
      _sum: { amount: true },
    });
    return {
      top5: result.map((row: any) => ({
        customerId: row.customerId,
        amount: row._sum.amount,
        ...(customerMap[row.customerId] || {}),
      })),
      totalPaid: totalPaid._sum.amount,
    };
  }

  async mostPaidTimes() {
    const result = await this.prisma.customerPayment.groupBy({
      by: ['customerId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });
    const customerIds = map(result, 'customerId');
    const customerMap: Record<string, any> = {};
    if (customerIds.length) {
      const customers = await this.prisma.customer.findMany({
        where: { id: { in: customerIds } },
        select: {
          weixin: true,
          weixinId: true,
          xianyu: true,
          id: true,
        },
      });
      merge(customerMap, keyBy(customers, 'id'));
    }
    const totalPaid = await this.prisma.customerPayment.count();
    return {
      top5: result.map((row: any) => ({
        customerId: row.customerId,
        amount: row._count.id,
        ...(customerMap[row.customerId] || {}),
      })),
      totalPaid: totalPaid,
    };
  }

  async upload(file: Express.Multer.File) {
    const workSheetsFromBuffer = xlsx.parse(file.buffer, { raw: true });
    const sheets = keyBy(workSheetsFromBuffer, 'name');
    const ordersData = sheets['订单'].data;
    ordersData.shift();
    const paymentsData = sheets['收款'].data;
    paymentsData.shift();
    const customerMap = new Map<string, Prisma.CustomerCreateInput>();
    const orderMap = new Map<string, Prisma.CustomerOrderCreateInput[]>();
    const paymentMap = new Map<string, Prisma.CustomerPaymentCreateInput[]>();
    for (const orderRow of ordersData) {
      if (!orderRow[0]) {
        continue;
      }
      const firstMessageTime = `${orderRow[0] + orderRow[1]}`;
      const order: Prisma.CustomerOrderCreateInput = {
        firstMessageTime: this.handleTime(firstMessageTime),
        status:
          orderRow[2] === '是'
            ? Number(OrderStatus.DELIVERY)
            : Number(OrderStatus.NONE),
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
        customer.firstMessageTime = new Date(order.firstMessageTime);
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
      const payment: Prisma.CustomerPaymentCreateInput = {
        payTime: this.handleTime(paymentRow[0]),
        payMethod: paymentRow[1],
        amount: paymentRow[2],
        extra: paymentRow[5],
      };
      if (paymentMap.has(customer.xianyu)) {
        paymentMap.get(customer.xianyu).push(payment);
      } else {
        paymentMap.set(customer.xianyu, [payment]);
      }
    }
    for (const customer of customerMap.values()) {
      const created = await this.prisma.customer.create({ data: customer });
      if (orderMap.has(customer.xianyu)) {
        await this.prisma.customerOrder.createMany({
          data: orderMap
            .get(customer.xianyu)
            .map((order) => ({ ...order, customer: created })),
        });
      }
      if (paymentMap.has(customer.xianyu)) {
        await this.prisma.customerPayment.createMany({
          data: paymentMap
            .get(customer.xianyu)
            .map((payment) => ({ ...payment, customer: created })),
        });
      }
    }
  }

  handleCustomer(str: string): Prisma.CustomerCreateInput {
    const result: Prisma.CustomerCreateInput = { accountId: '' };

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
