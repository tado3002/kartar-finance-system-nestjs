import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { GenericFilter } from '../../common/interfaces/generic-filter.interface';
import { Transform } from 'class-transformer';

export class TransactionFilter extends GenericFilter {
  @IsDateString()
  @IsOptional()
  fromDate?: string;
  @IsDateString()
  @IsOptional()
  toDate?: string;
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
