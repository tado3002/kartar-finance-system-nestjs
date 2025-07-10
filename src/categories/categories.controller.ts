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
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createData: CreateCategoryDto) {
    await this.categoriesService.create(createData);
    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: UpdateCategoryDto) {
    const categories = await this.categoriesService.one(+id);
    if (!categories)
      throw new NotFoundException({ error: 'category not found' });
    await this.categoriesService.update(+id, updateData);
    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const categories = await this.categoriesService.one(+id);
    if (!categories)
      throw new NotFoundException({ error: 'category not found' });
    await this.categoriesService.delete(+id);
    return {
      success: true,
    };
  }
}
