// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthResolver } from './resolvers/auth.resolver';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from './services/jwt.service'; // ADD THIS
import { JwtStrategy } from './strategies/jwt.strategy'; // ADD THIS
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy'; // ADD THIS
import { PrismaModule } from 'src/core/prisma/prisma.module'; // ADD THIS

@Module({
  imports: [
    UsersModule, 
    ConfigModule,
    PrismaModule, // ADD THIS
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [
    AuthResolver, 
    AuthService,
    JwtService, // ADD THIS
    JwtStrategy, // ADD THIS
    RefreshTokenStrategy, // ADD THIS
  ],
})
export class AuthModule {}