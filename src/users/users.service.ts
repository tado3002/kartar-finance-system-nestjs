import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './users.entity';
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
    const existUser = await this.findByEmail(data.email);
    if (existUser)
      throw new UnprocessableEntityException('Email has been taken');
    const newUser = this.userRepo.create(data);
    return await this.userRepo.save(newUser);
  }

  async updateRole(id: number, role: Role) {
    const user = await this.validateUser(id);
    user.role = role;
    await this.userRepo.save(user);
  }

  async remove(id: number) {
    await this.validateUser(id);
    await this.userRepo.delete({ id });
  }

  async validateUser(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
