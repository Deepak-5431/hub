import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { SendMessageInput } from './dto/send-message.input';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(input: CreateConversationInput) {
    // Input is already validated by DTO
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

  // TODO 1: Implement get conversation messages
  async getConversationMessages(conversationId: string) {
    // Your implementation here
    // Get all messages for a conversation, ordered by creation time
    // Include sender information
  }

  // TODO 2: Implement mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string) {
    // Your implementation here
    // Update all messages in conversation to include userId in readBy array
    // Only update messages that haven't been read by this user yet
  }

  // TODO 3: Implement get unread messages count
  async getUnreadCount(userId: string) {
    // Your implementation here
    // Count messages where user is participant but hasn't read the message
    // Hint: Count messages where readBy array doesn't include userId
  }
}