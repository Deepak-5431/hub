import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { SendMessageInput } from './dto/send-message.input';

@Resolver()
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Mutation(returns => String)
  async createConversation(@Args('input') input: CreateConversationInput) {
    return this.chatService.createConversation(input);
  }

  @Mutation(returns => String)
  async sendMessage(@Args('input') input: SendMessageInput) {
    const senderId = 'mock-user-id'; 
    return this.chatService.sendMessage(input, senderId);
  }

  @Query(returns => [String])
  async getConversations(@Args('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  @Query(returns => [String])
  async getConversationMessages(@Args('conversationId') conversationId: string) {
     return this.chatService.getConversationMessages(conversationId);
  }

  @Mutation(returns => Boolean)
  async markAsRead(
    @Args('conversationId') conversationId: string,
    @Args('userId') userId: string
  ) {
   return this.chatService.markMessagesAsRead(conversationId,userId)
  }

  @Query(returns => Number)
  async getUnreadCount(@Args('userId') userId: string) {
   return this.chatService.getUnreadCount(userId)
  }
}