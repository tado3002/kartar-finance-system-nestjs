import { Role } from 'src/users/users.entity';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  password: string;
}

export interface UserResponse extends Omit<User, 'password'> {}
