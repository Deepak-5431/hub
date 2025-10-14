// dto/send-message.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: 'TEXT' | 'IMAGE' | 'VIDEO' = 'TEXT'; 

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  repliedToId?: string; 
}