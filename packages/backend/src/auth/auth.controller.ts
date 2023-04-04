import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService, LoginResponse } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: LoginResponse }) { // localauthguard returns LoginResponse using validate
    return this.authService.login(req.user);
  }
}
