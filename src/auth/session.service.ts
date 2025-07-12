import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}
  async create(user: User): Promise<string> {
    const expiredAt = new Date(Date.now() + 3600 * 1000 * 24 * 30);
    const session = this.sessionRepo.create({
      uuid: crypto.randomUUID() as string,
      user,
      expiredAt,
    });
    await this.sessionRepo.save(session);
    return session.uuid;
  }
  async session(uuid: string): Promise<Session | null> {
    return await this.sessionRepo.findOne({
      where: { uuid },
      relations: ['user'],
    });
  }
  async delete(uuid: string): Promise<void> {
    await this.sessionRepo.delete({ uuid });
  }
}
