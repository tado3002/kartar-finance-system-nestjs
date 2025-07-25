import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Category } from 'src/categories/categories.entity';
import { Attachment } from 'src/cloudinary/attachment.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  amount: bigint;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  description: string;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'user_id', nullable: true })
  userId: number | null;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ name: 'created_by_id' })
  createdById: number;
  @ManyToOne(() => User, (user) => user.createdTransactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToOne(() => Attachment, (attachment) => attachment.transaction)
  attachment: Attachment;
}
