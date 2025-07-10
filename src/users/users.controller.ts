import {
  Body,
  Controller,
  Get,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { CreateUsersDto } from './create-users.dto';
import { User } from 'generated/prisma';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

interface UserResponse extends Omit<User, 'password'> {}

interface Response<T> {
  success: boolean;
  data?: T;
}

function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    username: user.email,
  };
}

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  async findAll(): Promise<Response<UserResponse[]>> {
    const users = await this.userService.users();
    return {
      success: true,
      data: users.map((user) => toUserResponse(user)),
    };
  }
  @Post()
  async create(@Body() createUserDto: CreateUsersDto): Promise<Response<null>> {
    const existUser = await this.userService.userByEmail(createUserDto.email);
    if (existUser)
      throw new UnprocessableEntityException({
        message: 'email sudah digunakan!',
      });
    await this.userService.create(createUserDto);
    return {
      success: true,
    };
  }
}
