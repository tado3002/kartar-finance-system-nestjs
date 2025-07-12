import {
  Body,
  Controller,
  Get,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'src/common/interfaces/response.interface';
import { UserResponse } from 'src/common/interfaces/user.interface';
import { toUserResponse } from 'src/common/lib/responseFormater';

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
    const existUser = await this.userService.findByEmail(createUserDto.email);
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
