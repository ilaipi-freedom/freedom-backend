import { Entity, Column } from 'typeorm';

import { BaseEntity } from '../base.entity';

@Entity()
export class Account extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;
}
