import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { SendMessageInput } from './dto/send-message.input';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(input: CreateConversationInput) {
    const result = await this.prisma.conversation.create({
      data: {
        title: input.title,
        type: input.participantIds.length > 2 ? 'GROUP' : 'DIRECT',
        participants: {
          create: input.participantIds.map(userId => ({ userId }))
        }
      },
      include: {
        participants: { include: { user: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    return JSON.stringify(result);
  }

  async sendMessage(input: SendMessageInput, senderId: string) {
    // Input validated by DTO, senderId from auth
    const message = await this.prisma.message.create({
      data: {
        content: input.content,
        type: input.type || 'TEXT',
        conversationId: input.conversationId,
        senderId: senderId,
        repliedToId: input.repliedToId
      },
      include: {
        sender: true,
        conversation: { include: { participants: true } }
      }
    });

    // Update conversation's last message
    await this.prisma.conversation.update({
      where: { id: input.conversationId },
      data: { 
        lastMessage: input.content,
        lastMessageAt: new Date(),
        updatedAt: new Date()
      }
    });

    return message;
  }

  async getUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: { some: { userId } }
      },
      include: {
        participants: { include: { user: true } },
        messages: { 
          orderBy: { createdAt: 'desc' },
          take: 1 
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getConversationMessages(conversationId: string) {
   return this.prisma.message.findMany({
    where: {conversationId},
    include:{sender:true},
    orderBy:{createdAt:'asc'}
   })
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    const { count } = await this.prisma.message.updateMany({
    where: {
      conversationId,
      NOT: { readBy: { has: userId } },
      senderId: { not: userId }
    },
    data: { readBy: { push: userId } }
  });
  
  return count;
  }

  // TODO 3: Implement get unread messages count
  async getUnreadCount(userId: string) {
    // Your implementation here
    // Count messages where user is participant but hasn't read the message
    // Hint: Count messages where readBy array doesn't include userId
  }
}