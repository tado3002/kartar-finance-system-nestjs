import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async findById(id: number): Promise<User | null> {
    return await this.userRepo.findOneBy({ id });
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
  }

  async users(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async create(data: CreateUsersDto): Promise<User> {
    const newUser = this.userRepo.create(data);
    return await this.userRepo.save(newUser);
  }
}
