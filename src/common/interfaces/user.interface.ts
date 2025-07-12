export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface UserResponse extends Omit<User, 'password'> {}
