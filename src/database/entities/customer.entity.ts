import { Entity, Column, ManyToOne } from 'typeorm';

import { Account } from './account.entity';
import { BaseEntity } from '../base.entity';

@Entity()
export class Customer extends BaseEntity {
  @Column({ nullable: true })
  weixin: string;

  @Column({ nullable: true })
  weixinId: string;

  @Column({ nullable: true })
  xianyu: string;

  @Column({ nullable: true })
  qq: string;

  @Column({ nullable: true })
  qqNum: string;

  @Column({ nullable: true })
  firstMessageTime: Date;

  @ManyToOne(() => Account)
  account: Account;
}
