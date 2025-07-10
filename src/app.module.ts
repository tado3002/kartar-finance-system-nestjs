import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { PrismaService } from './prisma.service';
import { UsersService } from './users/users.service';
import { AuthController } from './auth/auth.controller';
import { SessionService } from './auth/session.service';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { TransactionsModule } from './transacions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [
    AppController,
    UsersController,
    AuthController,
    CategoriesController,
  ],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    SessionService,
    CategoriesService,
  ],
})
export class AppModule {}
