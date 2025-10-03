import { InputType, Field } from '@nestjs/graphql';
import { IsEmail,IsOptional,MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  email: string;

   @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String)
  @MinLength(6)
  password!: string;
}