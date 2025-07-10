import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { CreateUsersDto } from './create-users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async userById(id: number): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }
  async userByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async users(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async create(data: CreateUsersDto): Promise<void> {
    await this.prisma.user.create({ data });
  }
}
