import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Account } from './account.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  weixin: string;

  @Column()
  weixinId: string;

  @Column()
  xianyu: string;

  @Column()
  qq: string;

  @Column()
  qqNum: string;

  @Column()
  firstMessageTime: Date;

  @ManyToOne(() => Account)
  account: Account;
}
