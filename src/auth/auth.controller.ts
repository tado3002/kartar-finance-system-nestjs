import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/auth.dto';
import { SessionService } from './session.service';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly sessionService: SessionService,
  ) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user)
      throw new UnauthorizedException({ message: 'email atau password salah' });
    const isPasswordMatch = user.password === loginDto.password;
    if (!isPasswordMatch)
      throw new UnauthorizedException({ message: 'email atau password salah' });

    const session = await this.sessionService.create(user);
    const data = {
      success: true,
      data: {
        user: {
          username: user.username,
          email: user.email,
        },
        sessionId: session,
      },
    };
    return data;
  }
  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    const authorization = req.headers['authorization'];
    const sessionId = authorization!.slice(7);
    await this.sessionService.delete(sessionId);
    return {
      success: true,
    };
  }
}
