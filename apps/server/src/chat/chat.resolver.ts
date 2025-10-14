import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { SendMessageInput } from './dto/send-message.input';
import { Conversation, Message } from '@prisma/client';

@Resolver('Chat')
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Mutation(() => Conversation)
  async createConversation(
    @Args('input') input: CreateConversationInput
  ): Promise<Conversation> {
    return this.chatService.createConversation(input);
  }

  @Mutation(() => Message)
  async sendMessage(
    @Args('input') input: SendMessageInput,
    @Context() context: any
  ): Promise<Message> {
    const senderId = 'mock-user-id'; // TODO: Replace with context.req.user.id
    return this.chatService.sendMessage(input, senderId);
  }

  @Query(() => [Conversation])
  async getConversations(
    @Args('userId') userId: string
  ): Promise<Conversation[]> {
    return this.chatService.getUserConversations(userId);
  }

  @Query(() => [Message])
  async getConversationMessages(
    @Args('conversationId') conversationId: string
  ): Promise<Message[]> {
    return this.chatService.getConversationMessages(conversationId);
  }

  // TODO 5: Implement this mutation - Mark conversation as read
  @Mutation(() => Boolean)
  async markConversationAsRead(
    @Args('conversationId') conversationId: string,
    @Args('userId') userId: string
  ): Promise<boolean> {
    // Your implementation here
    // Hint: Use chatService.markMessagesAsRead
    return true;
  }

  // TODO 6: Implement this query - Get unread messages count
  @Query(() => Number)
  async getUnreadMessagesCount(
    @Args('userId') userId: string
  ): Promise<number> {
    // Your implementation here
    // Hint: Use chatService.getUnreadCount
    return 0;
  }
}