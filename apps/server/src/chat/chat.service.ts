import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service'; // Adjust path as needed
import { CreateConversationInput } from './dto/create-conversation.input';
import { SendMessageInput } from './dto/send-message.input';
import { Conversation, Message } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(input: CreateConversationInput): Promise<Conversation> {
    return this.prisma.conversation.create({
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
  }

  async sendMessage(input: SendMessageInput, senderId: string): Promise<Message> {
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

  async getUserConversations(userId: string): Promise<Conversation[]> {
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

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' }
    });
  }

  // TODO 1: Implement message deletion (soft delete)
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    // Your implementation here
    // Hint: Update message.deletedAt and verify user owns the message
    return true;
  }

  // TODO 2: Implement adding participants to existing conversation
  async addParticipants(conversationId: string, userIds: string[]): Promise<Conversation> {
    // Your implementation here
    // Hint: Create multiple participant records
  }
}