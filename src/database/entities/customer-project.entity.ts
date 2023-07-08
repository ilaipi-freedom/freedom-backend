import { Entity, Column, ManyToOne } from 'typeorm';

import { Customer } from './customer.entity';
import { Account } from './account.entity';
import { BaseEntity } from '../base.entity';

@Entity()
export class CustomerProject extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Column({ type: 'longtext', nullable: true })
  content: string;

  @Column({ type: 'longtext', nullable: true })
  extra: string;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => Account, { nullable: true })
  account: Account;
}
