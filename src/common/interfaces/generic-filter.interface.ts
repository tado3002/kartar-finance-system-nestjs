import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class GenericFilter {
  @IsOptional()
  @Transform(({ value }) => {
    const page = Number(value);
    return page < 1 ? 1 : page;
  })
  @IsNumber({}, { message: 'page params must number' })
  page?: number = 1;
  @IsOptional()
  @Transform(({ value }) => {
    const size = Number(value);
    return size < 1 ? 10 : size;
  })
  @IsNumber({}, { message: 'page params must number' })
  limit?: number = 10;
  @IsOptional()
  @IsEnum(Sort)
  sort?: Sort = Sort.DESC;
}
