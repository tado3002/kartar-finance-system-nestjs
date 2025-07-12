import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Type } from '../categories.entity';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  @IsEnum(Type)
  type: Type;
}
