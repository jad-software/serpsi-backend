// src/common/logger/log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class LogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  level: 'info' | 'warn' | 'error';

  @Column()
  message: string;

  @Column()
  context: string;

  @Column('jsonb', { nullable: true })
  meta?: any;

  @CreateDateColumn()
  createdAt: Date;
}
