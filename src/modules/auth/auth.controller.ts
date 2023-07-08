import { Body, Controller, Post } from '@nestjs/common';

import { LoginDto } from './dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/public';
import { CurrentUser } from 'src/common/current-user';
import { AdminAuthSession } from 'src/types/Auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.signIn(payload.username, payload.password);
  }

  @Post('logout')
  async logout(@CurrentUser() payload: AdminAuthSession) {
    return this.authService.signOut(payload);
  }
}
