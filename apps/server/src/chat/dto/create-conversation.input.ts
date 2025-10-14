// dto/create-conversation.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateConversationInput {
  @Field(() => [String])
  @IsArray()
  participantIds: string[]; 

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string; 

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: 'DIRECT' | 'GROUP'; 
}