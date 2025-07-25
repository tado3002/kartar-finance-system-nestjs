import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}
  async create(data: CreateCategoryDto): Promise<void> {
    const category = this.categoryRepo.create({ ...data });
    await this.categoryRepo.save(category);
  }

  async all(): Promise<Category[]> {
    return await this.categoryRepo.find();
  }

  async update(id: number, data: UpdateCategoryDto): Promise<void> {
    const category = await this.one(id);
    Object.assign(category!, data);
    await this.categoryRepo.save(category!);
  }

  async one(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async delete(id: number): Promise<void> {
    await this.one(id);
    await this.categoryRepo.delete(id);
  }
}
