import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../common/interfaces/user.interface';
import { Role } from '../users.entity';
export class CreateUsersDto implements Omit<User, 'id'> {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
