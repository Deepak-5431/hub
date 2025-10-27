// dto/typing.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class TypingInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  userId: string; 
}