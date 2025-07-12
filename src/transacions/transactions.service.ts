import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transactions.entity';
import { Category } from 'src/categories/categories.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: ['category', 'user'],
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        category: {
          id: true,
          name: true,
          type: true,
        },
        user: {
          id: true,
          username: true,
          email: true,
        },
      },
    });
  }

  async create(user: User, data: CreateTransactionDto): Promise<Transaction> {
    const category = await this.categoryRepository.findOneBy({
      id: data.category_id,
    });
    if (!category)
      throw new NotFoundException({ message: 'category not found' });

    const transaction = new Transaction();
    transaction.amount = data.amount;
    transaction.description = data.description;
    transaction.date = data.date;
    transaction.categoryId = category.id;
    transaction.category = category;
    transaction.userId = user.id;
    transaction.user = user;

    return await this.transactionRepository.save(transaction);
  }

  async update(
    id: number,
    user: User,
    data: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.preload({
      id,
      ...data,
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    if (data.category_id) {
      const category = await this.categoryRepository.findOneBy({
        id: data.category_id,
      });
      if (!category)
        throw new NotFoundException({ message: 'category not found' });
      transaction.category = category;
    }

    transaction.user = user;

    return await this.transactionRepository.save(transaction);
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async delete(id: number): Promise<void> {
    const result = await this.transactionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { user: { id: userId } },
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async getTransactionsByCategory(categoryId: number): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { category: { id: categoryId } },
      relations: ['user'],
    });
  }
}
