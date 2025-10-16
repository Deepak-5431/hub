import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { SendMessageInput } from './dto/send-message.input';

@Resolver()
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  // Working mutations
  @Mutation(returns => Object)
  async createConversation(@Args('input') input: CreateConversationInput) {
    return this.chatService.createConversation(input);
  }

  @Mutation(returns => Object)
  async sendMessage(@Args('input') input: SendMessageInput) {
    const senderId = 'mock-user-id'; // TODO: Get from auth context
    return this.chatService.sendMessage(input, senderId);
  }

  // Working query
  @Query(returns => [Object])
  async getConversations(@Args('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  // TODO 4: Implement get conversation messages query
  @Query(returns => [Object])
  async getConversationMessages(@Args('conversationId') conversationId: string) {
    // Your implementation here
    // Call chatService.getConversationMessages
  }

  // TODO 5: Implement mark as read mutation
  @Mutation(returns => Boolean)
  async markAsRead(
    @Args('conversationId') conversationId: string,
    @Args('userId') userId: string
  ) {
    // Your implementation here
    // Call chatService.markMessagesAsRead
  }

  // TODO 6: Implement unread count query
  @Query(returns => Number)
  async getUnreadCount(@Args('userId') userId: string) {
    // Your implementation here
    // Call chatService.getUnreadCount
  }
}