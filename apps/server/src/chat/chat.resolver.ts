// chat.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { SendMessageInput } from './dto/send-message.input';

// GraphQL types
@ObjectType()
class Conversation {
  @Field() id: string;
  @Field({ nullable: true }) title?: string;
  @Field() type: string;
  @Field() createdAt: Date;
}

@ObjectType()
class Message {
  @Field() id: string;
  @Field() content: string;
  @Field() senderId: string;
  @Field() createdAt: Date;
}

@Resolver(() => Conversation)
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  // Mutation: CREATE new conversation
  @Mutation(() => Conversation)
  async createConversation(@Args('input') input: CreateConversationInput) {
    return this.chatService.createConversation(input);
  }

  // Mutation: SEND message to conversation
  @Mutation(() => Message)
  async sendMessage(@Args('input') input: SendMessageInput) {
    const senderId = 'mock-user-id'; // TODO: Get from auth
    return this.chatService.sendMessage(input, senderId);
  }

  // Query: GET user's conversations
  @Query(() => [Conversation])
  async getConversations(@Args('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  // TODO 3: Query to get messages in conversation
  @Query(() => [Message])
  async getConversationMessages(@Args('conversationId') conversationId: string) {
    // Your implementation here
    // Hint: Call chatService.getConversationMessages
  }

  // TODO 4: Mutation to mark conversation as read
  @Mutation(() => Boolean)
  async markAsRead(
    @Args('conversationId') conversationId: string,
    @Args('userId') userId: string
  ) {
    // Your implementation here
    // Hint: Call chatService.markMessagesAsRead
  }
}