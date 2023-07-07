import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Customer } from './customer.entity';
import { Account } from './account.entity';

@Entity()
export class CustomerProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
