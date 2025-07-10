import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transaction } from 'generated/prisma';

export class CreateTransactionDto implements Omit<Transaction, 'id'> {
  @IsNotEmpty()
  @IsNumber()
  amount: bigint;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : new Date()))
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
