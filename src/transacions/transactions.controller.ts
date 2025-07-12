import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createData: CreateTransactionDto, @Req() req: Request) {
    const sessionId = req.headers.authorization!.slice(7);

    const session = await this.sessionService.session(sessionId);

    await this.transactionService.create(session!.user, createData);
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

    await this.transactionService.update(+id, session!.user, updateData);
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
