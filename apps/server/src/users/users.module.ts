// apps/server/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResolver } from './users.resolver';
import { PrismaModule } from '../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersService,UserResolver],
  exports: [UsersService,UserResolver], 
})
export class UsersModule {}