import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
