import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from 'src/users/users.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  async findAll() {
    const categories = await this.categoriesService.all();
    return {
      success: true,
      data: categories,
    };
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FINANCE, Role.ADMIN)
  @Post()
  async create(@Body() createData: CreateCategoryDto) {
    await this.categoriesService.create(createData);
    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FINANCE, Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: UpdateCategoryDto) {
    await this.categoriesService.update(+id, updateData);
    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FINANCE, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.delete(+id);
    return {
      success: true,
    };
  }
}
