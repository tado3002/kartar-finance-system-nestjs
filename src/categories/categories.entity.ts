import { Transaction } from 'src/transacions/transactions.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum Type {
  Income = 'Income',
  Expense = 'Expense',
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Type,
    default: Type.Income,
  })
  type: Type;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
}
