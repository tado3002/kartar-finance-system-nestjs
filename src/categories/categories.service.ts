import { Injectable } from '@nestjs/common';
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
    const category = await this.categoryRepo.findOneBy({ id });
    Object.assign(category!, data);
    await this.categoryRepo.save(category!);
  }

  async one(id: number): Promise<Category | null> {
    return await this.categoryRepo.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepo.delete(id);
  }
}
