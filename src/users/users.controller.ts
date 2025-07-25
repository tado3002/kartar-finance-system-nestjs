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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from './users.entity';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  @Roles(Role.ADMIN, Role.FINANCE)
  async findAll(): Promise<Response<UserResponse[]>> {
    const users = await this.userService.users();
    return {
      success: true,
      data: users.map((user) => toUserResponse(user)),
    };
  }
  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createUserDto: CreateUsersDto): Promise<Response<null>> {
    await this.userService.create(createUserDto);
    return {
      success: true,
    };
  }
  @Put(':id/update-role')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Pick<CreateUsersDto, 'role'>,
  ) {
    await this.userService.updateRole(+id, updateUserDto.role);

    return {
      success: true,
    };
  }
  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    await this.userService.remove(+id);
    return {
      success: true,
    };
  }
}
