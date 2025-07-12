import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/common/interfaces/user.interface';
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
}
