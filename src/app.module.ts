import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transacions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

import * as dotenv from 'dotenv';
import { User } from './users/users.entity';
import { Session } from './auth/session.entity';
import { Transaction } from './transacions/transactions.entity';
import { Category } from './categories/categories.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { Attachment } from './cloudinary/attachment.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      entities: [User, Session, Transaction, Category, Attachment],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    TransactionsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
