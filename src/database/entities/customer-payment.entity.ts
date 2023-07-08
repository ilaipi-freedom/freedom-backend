import { Entity, Column, ManyToOne } from 'typeorm';

import { Customer } from './customer.entity';
import { Account } from './account.entity';
import { CustomerOrder } from './customer-order.entity';
import { PaymentMethod } from 'src/types/PaymentType';
import { CustomerProject } from './customer-project.entity';
import { BaseEntity } from '../base.entity';

@Entity()
export class CustomerPayment extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '支付金额',
  })
  amount: number;

  @Column()
  payTime: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.XIANYU,
  })
  payMethod: PaymentMethod;

  @Column({
    type: 'text',
    comment: '支付备注',
    nullable: true,
  })
  extra: string;

  @ManyToOne(() => CustomerOrder, { nullable: true })
  order: CustomerOrder;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => Account, { nullable: true })
  account: Account;

  @ManyToOne(() => CustomerProject, { nullable: true })
  project: CustomerProject;
}
