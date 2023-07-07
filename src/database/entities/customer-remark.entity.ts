import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Customer } from './customer.entity';
import { Account } from './account.entity';
import { CustomerProject } from './customer-project.entity';

@Entity()
export class CustomerRemark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
