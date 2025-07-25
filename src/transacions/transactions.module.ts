import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CategoriesService } from 'src/categories/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { Category } from 'src/categories/categories.entity';
import { User } from 'src/users/users.entity';
import { SessionService } from 'src/auth/session.service';
import { Session } from 'src/auth/session.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { Attachment } from 'src/cloudinary/attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Category,
      User,
      Session,
      Attachment,
    ]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    CategoriesService,
    SessionService,
    CloudinaryProvider,
    CloudinaryService,
  ],
})
export class TransactionsModule {}
