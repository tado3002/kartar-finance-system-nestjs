import { Transaction } from 'src/transacions/transactions.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publicId: string;

  @Column()
  url: string;

  @Column()
  secureUrl: string;

  @Column()
  format: string;

  @Column({ type: 'int' })
  bytes: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @OneToOne(() => Transaction, (transaction) => transaction.attachment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column({ name: 'transaction_id', unique: true })
  transactionId: number;
}
