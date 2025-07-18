import { User } from 'src/common/interfaces/user.interface';
import { UserResponse } from 'src/common/interfaces/user.interface';

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };
}
