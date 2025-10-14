// dto/update-conversation.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray } from 'class-validator';

@InputType()
export class UpdateConversationInput {
  @Field()
  @IsString()
  conversationId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string; 

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  addParticipants?: string[]; 

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  removeParticipants?: string[]; 
}