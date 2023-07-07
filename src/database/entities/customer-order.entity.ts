import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Customer } from './customer.entity';
import { Account } from './account.entity';
import { OrderFrom, OrderStatus } from 'src/types/OrderType';
import { CustomerProject } from './customer-project.entity';

@Entity()
export class CustomerOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstMessageTime: Date;

  @Column({ nullable: true })
  orderTime: Date;

  @Column({ nullable: true })
  deliveryTime: Date;

  @Column({
    type: 'enum',
    comment: '订单来源',
    enum: OrderFrom,
    default: OrderFrom.XIANYU,
  })
  from: OrderFrom;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.INIT,
  })
  status: OrderStatus;

  @Column({
    type: 'varchar',
    length: 150,
    comment: '行业类型',
    nullable: true,
  })
  industry: string;

  @Column({
    type: 'varchar',
    length: 150,
    comment: '行业详情',
    nullable: true,
  })
  industryDetail: string;

  @Column({
    type: 'text',
    comment: '工作内容',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'longtext',
    comment: '工作详情',
    nullable: true,
  })
  detail: string;

  @Column({
    type: 'longtext',
    comment: '额外信息',
    nullable: true,
  })
  extra: string;

  @Column({
    type: 'text',
    comment: '仓库地址',
    nullable: true,
  })
  repo: string;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => Account, { nullable: true })
  account: Account;

  @ManyToOne(() => CustomerProject, { nullable: true })
  project: CustomerProject;
}
