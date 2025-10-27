import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/core/prisma/prisma.service';
@Module({
  providers: [ChatResolver, ChatService, ChatGateway,PrismaService]
})
export class ChatModule {}
