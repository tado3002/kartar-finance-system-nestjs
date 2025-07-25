import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { Attachment } from './attachment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CloudinaryService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
  ) {}
  public async create(
    transactionId: number,
    file: Express.Multer.File,
  ): Promise<Attachment> {
    const fileUploaded = await this.uploadAttachment(file);
    const attachment = await this.attachmentRepository.save({
      publicId: fileUploaded?.public_id,
      bytes: fileUploaded?.bytes,
      format: fileUploaded?.format,
      secureUrl: fileUploaded?.secure_url,
      url: fileUploaded?.url,
      uploadedAt: new Date(),
      transactionId,
    });

    return attachment;
  }
  private async uploadAttachment(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | undefined> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'transactions', allowed_formats: ['jpg', 'png', 'pdf'] },
        (err, res) => {
          if (err) return reject(err);
          resolve(res);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
  async deleteAttachment(attachment: Attachment) {
    await cloudinary.uploader.destroy(attachment.publicId);
    await this.attachmentRepository.delete({ id: attachment.id });
  }
}
