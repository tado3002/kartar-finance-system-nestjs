import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import { SessionService } from 'src/auth/session.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    PrismaService,
    SessionService,
    CategoriesService,
  ],
})
export class TransactionsModule {}
