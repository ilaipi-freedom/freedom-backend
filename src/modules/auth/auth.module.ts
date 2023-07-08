import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    AccountModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (service: ConfigService) => {
        const secret = await service.get('env.jwt.secret');
        return {
          secret,
          signOptions: { expiresIn: '1w' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
