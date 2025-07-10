import { Injectable } from '@nestjs/common';
import { Transaction } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}
  async transactions(): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany({
      include: {
        category: true,
      },
    });
  }

  async create(data: CreateTransactionDto): Promise<void> {
    await this.prisma.transaction.create({ data });
  }

  async update(id: number, data: UpdateTransactionDto): Promise<void> {
    await this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async one(id: number): Promise<Transaction | null> {
    return await this.prisma.transaction.findFirst({
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }
}
