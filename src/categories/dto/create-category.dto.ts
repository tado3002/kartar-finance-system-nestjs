import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { $Enums, Category } from 'generated/prisma';

export class CreateCategoryDto implements Omit<Category, 'id'> {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  @IsEnum($Enums.Type)
  type: $Enums.Type;
}
