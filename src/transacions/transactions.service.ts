import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transactions.entity';
import { Category } from 'src/categories/categories.entity';
import { User } from 'src/users/users.entity';
import { TransactionFilter } from './dto/transaction-filter';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: ['category', 'user', 'attachment'],
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
        },
        attachment: true,
      },
    });
  }

  async paginate(filter: TransactionFilter): Promise<[Transaction[], number]> {
    return await this.transactionRepository.findAndCount({
      where: {
        categoryId: filter.categoryId,
      },
      order: { id: filter.sort },
      skip: (filter.page! - 1) * (filter.limit! + 1),
      take: filter.limit!,
      relations: ['category'],
    });
  }

  async create(
    createdBy: User,
    data: CreateTransactionDto,
    file?: Express.Multer.File,
  ): Promise<Transaction> {
    // category validation
    const category = await this.validateCategory(data.categoryId);

    // user validation
    const user = await this.validateUserIfProvided(data.userId);

    const transaction = await this.transactionRepository.save({
      ...data,
      category,
      createdBy,
      createdById: createdBy.id,
      user,
    });

    if (file) await this.cloudinaryService.create(transaction.id, file);
    return transaction;
  }

  async update(
    id: number,
    createdBy: User,
    data: UpdateTransactionDto,
    isRemoveAttachment: boolean,
    file?: Express.Multer.File,
  ): Promise<Transaction> {
    // preload transaction
    const transaction = await this.findOne(id);

    // category data handling
    if (data.categoryId) {
      const category = await this.validateCategory(data.categoryId);
      transaction.category = category;
    }

    // user data handling
    if (data.userId === 0) {
      transaction.user = null;
      transaction.userId = null;
    } else if (data.userId) {
      const user = await this.validateUserIfProvided(data.userId);
      transaction.userId = user!.id;
      transaction.user = user!;
    }

    // delete attachment
    if (isRemoveAttachment && transaction.attachment) {
      await this.cloudinaryService.deleteAttachment(transaction.attachment);
    }

    // update attachment
    if (file) {
      // delete old attachment
      if (transaction.attachment)
        await this.cloudinaryService.deleteAttachment(transaction.attachment);
      // create new attachment
      const attachment = await this.cloudinaryService.create(id, file);
      transaction.attachment = attachment;
    }

    transaction.createdById = createdBy.id;
    transaction.createdBy = createdBy;

    if (data.amount) transaction.amount = data.amount;
    if (data.description) transaction.description = data.description;
    if (data.date) transaction.date = data.date;

    return await this.transactionRepository.save(transaction);
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['category', 'user', 'attachment'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async delete(id: number): Promise<void> {
    const transaction = await this.findOne(id);
    // delete file in cloudinary if attachment exist
    if (transaction.attachment)
      await this.cloudinaryService.deleteAttachment(transaction.attachment);
    await this.transactionRepository.delete(id);
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { userId },
      relations: ['category', 'attachment'],
    });
  }
  async validateCategory(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async validateUserIfProvided(id?: number): Promise<User | undefined> {
    if (!id) return undefined;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
