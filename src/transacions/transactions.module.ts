import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CategoriesService } from 'src/categories/categories.service';
import { SessionService } from 'src/auth/session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { Session } from 'src/auth/session.entity';
import { Category } from 'src/categories/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Session, Category])],
  controllers: [TransactionsController],
  providers: [TransactionsService, SessionService, CategoriesService],
})
export class TransactionsModule {}
