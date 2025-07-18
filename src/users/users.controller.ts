import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from '../common/interfaces/response.interface';
import { UserResponse } from '../common/interfaces/user.interface';
import { toUserResponse } from '../common/lib/responseFormater';
import { AdminRoleGuard } from '../common/guards/admin-role.guard';

@UseGuards(AuthGuard, AdminRoleGuard)
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
  @Put(':id/update-role')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Pick<CreateUsersDto, 'role'>,
  ) {
    const existUser = await this.userService.findById(+id);
    if (!existUser)
      throw new NotFoundException({ mesage: 'user id not found' });
    await this.userService.updateRole(existUser, updateUserDto.role);

    return {
      success: true,
    };
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const existUser = await this.userService.findById(+id);
    if (!existUser)
      throw new NotFoundException({ mesage: 'user id not found' });
    await this.userService.remove(+id);
    return {
      success: true,
    };
  }
}
