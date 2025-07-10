import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if (!authorization)
      throw new UnauthorizedException({ message: 'not authenticated' });
    const sessionUuid = authorization.includes('Bearer')
      ? authorization.slice(7)
      : undefined;
    if (!sessionUuid)
      throw new UnauthorizedException({ message: 'not authenticated' });
    const session = await this.sessionService.session(sessionUuid);
    if (!session)
      throw new UnauthorizedException({ message: 'invalid session' });
    const isSessionExpires: boolean =
      new Date(session.expiredAt) <= new Date(Date.now());
    if (isSessionExpires) {
      await this.sessionService.delete(sessionUuid);
      throw new UnauthorizedException({ message: 'session expired' });
    }

    return true;
  }
}
