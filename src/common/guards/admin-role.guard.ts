import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from 'src/users/users.entity';

export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;
    const isAdmin = req.user?.role === Role.ADMIN;
    if (!isAdmin)
      throw new ForbiddenException({ message: 'Feature for role admin' });
    return true;
  }
}
