import { Injectable } from '@nestjs/common';
import { Session } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: number): Promise<string> {
    const expiredAt = new Date(Date.now() + 3600 * 1000 * 24 * 30);
    const session = await this.prisma.session.create({
      data: {
        userId,
        expiredAt,
      },
    });
    return session.uuid;
  }
  async session(uuid: string): Promise<Session | null> {
    return await this.prisma.session.findFirst({
      where: {
        uuid,
      },
    });
  }
  async delete(uuid: string): Promise<void> {
    await this.prisma.session.delete({
      where: {
        uuid,
      },
    });
  }
}
