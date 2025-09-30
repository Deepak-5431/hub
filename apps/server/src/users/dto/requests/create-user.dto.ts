import { InputType } from '@nestjs/graphql';
import { IsEmail ,  IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  name?: string;

  
  @MinLength(6)
  password: string;
}