import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from 'generated/prisma';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateCategoryDto): Promise<void> {
    await this.prisma.category.create({ data });
  }

  async all(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }

  async update(id: number, data: UpdateCategoryDto): Promise<void> {
    await this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async one(id: number): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
