import { Body, Controller, Post } from '@nestjs/common';

import { LoginDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.signIn(payload.username, payload.password);
  }
}
