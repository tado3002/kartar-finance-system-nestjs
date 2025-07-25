import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
