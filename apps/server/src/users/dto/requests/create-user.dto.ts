import { InputType,Field } from '@nestjs/graphql';
import { IsEmail ,  IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateUserDto {
   @Field(() => String)
  @IsEmail()
  email: string;

  @IsOptional()
  name?: string;

  
  @MinLength(6)
   @Field(() => String)
  password: string;
}