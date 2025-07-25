import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  amount: bigint;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : new Date()))
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  categoryId: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  userId: number;
}
