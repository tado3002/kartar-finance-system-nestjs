import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { SessionService } from 'src/auth/session.service';
import { Session } from 'src/auth/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Session])],
  controllers: [CategoriesController],
  providers: [CategoriesService, SessionService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
