import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) return null;
    const allowedTypes = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'application/pdf',
    ];
    if (!allowedTypes.includes(value.mimetype))
      throw new BadRequestException({ message: 'File type not allowed' });
    const maxSize = 3 * 1024 ** 2;
    if (value.size > maxSize)
      throw new BadRequestException({ message: 'File max size 3mb' });

    return value;
  }
}
