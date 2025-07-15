import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Request } from 'express';
import { SessionService } from 'src/auth/session.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Category } from 'src/categories/categories.entity';
import { TransactionFilter } from './dto/transaction-filter';
import { User } from 'src/users/users.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionService: TransactionsService,
    private readonly sessionService: SessionService,
  ) {}
  @Get()
  async all() {
    const transactions = await this.transactionService.findAll();
    return {
      success: true,
      data: transactions.map((transaction) => ({
        ...transaction,
        amount: transaction.amount.toString(),
      })),
    };
  }
  @Get('list')
  async list(@Query() filter: TransactionFilter) {
    const transactions = await this.transactionService.paginate(filter);
    return {
      success: true,
      data: {
        items: transactions[0],
        pagination: {
          page: filter.page,
          perPage: filter.limit,
          totalItem: transactions[1],
        },
      },
    };
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createData: CreateTransactionDto, @Req() req: Request) {
    const currentUser = req.user!;
    await this.transactionService.create(currentUser, createData);
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
    const currentUser = req.user!;
    updateData.user_id = currentUser.id;

    await this.transactionService.update(+id, currentUser, updateData);
    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.transactionService.delete(+id);
    return {
      success: true,
    };
  }
}
