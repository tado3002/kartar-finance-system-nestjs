import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/users.entity';

export class LoginDto implements Pick<User, 'email' | 'password'> {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
