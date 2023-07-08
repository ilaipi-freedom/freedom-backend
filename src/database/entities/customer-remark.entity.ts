import { Entity, Column, ManyToOne } from 'typeorm';

import { Customer } from './customer.entity';
import { Account } from './account.entity';
import { CustomerProject } from './customer-project.entity';
import { BaseEntity } from '../base.entity';

@Entity()
export class CustomerRemark extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => Account, { nullable: true })
  account: Account;

  @ManyToOne(() => CustomerProject, { nullable: true })
  project: CustomerProject;
}
