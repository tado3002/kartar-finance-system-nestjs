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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Category } from 'src/categories/categories.entity';
import { TransactionFilter } from './dto/transaction-filter';
import { Role, User } from 'src/users/users.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from './file-validation.pipe';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

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
  @Get('my-transactions')
  async myTransactions(@Req() req: Request) {
    const user = req.user!;
    const transactions = await this.transactionService.getTransactionsByUser(
      user.id,
    );
    return {
      success: true,
      data: transactions,
    };
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FINANCE, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @Body() createData: CreateTransactionDto,
    @Req() req: Request,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    const currentUser = req.user!;
    await this.transactionService.create(currentUser, createData, file);
    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FINANCE, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateTransactionDto,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Query('removeAttachment') removeAttachment: boolean,
    @Req() req: Request,
  ) {
    const currentUser = req.user!;

    await this.transactionService.update(
      +id,
      currentUser,
      updateData,
      removeAttachment,
      file,
    );
    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.FINANCE, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.transactionService.delete(+id);
    return {
      success: true,
    };
  }
}
