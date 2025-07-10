import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Request } from 'express';
import { SessionService } from 'src/auth/session.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionService: TransactionsService,
    private readonly sessionService: SessionService,
    private readonly categoryService: CategoriesService,
  ) {}
  @Get()
  async all() {
    const transactions = await this.transactionService.transactions();
    return {
      success: true,
      data: transactions.map((transaction) => ({
        ...transaction,
        amount: transaction.amount.toString(),
      })),
    };
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createData: CreateTransactionDto, @Req() req: Request) {
    const sessionId = req.headers.authorization!.slice(7);
    const session = await this.sessionService.session(sessionId);
    createData.user_id = session!.userId;

    const category = await this.categoryService.one(createData.category_id);
    if (!category) throw new NotFoundException({ error: 'category not found' });

    await this.transactionService.create(createData);
    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateTransactionDto,
    @Req() req: Request,
  ) {
    const sessionId = req.headers.authorization!.slice(7);
    const session = await this.sessionService.session(sessionId);
    updateData.user_id = session!.userId;

    if (updateData.category_id) {
      const category = await this.categoryService.one(updateData.category_id);
      if (!category)
        throw new NotFoundException({ error: 'category not found' });
    }

    const transaction = await this.transactionService.one(+id);
    if (!transaction)
      throw new NotFoundException({ error: 'transaction not found' });

    await this.transactionService.update(+id, updateData);
    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const transaction = await this.transactionService.one(+id);
    if (!transaction)
      throw new NotFoundException({ message: 'transaction not found' });
    await this.transactionService.delete(+id);
    return {
      success: true,
    };
  }
}
