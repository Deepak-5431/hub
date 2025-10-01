// File: apps/server/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service'
import { AuthResolver } from './resolvers/auth.resolver'
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule, 
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}