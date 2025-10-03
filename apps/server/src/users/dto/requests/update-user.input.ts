
import { InputType,Field,PartialType } from "@nestjs/graphql";
import { CreateUserInput } from "src/auth/dto/requests/create-user.input";
import { IsOptional,IsString,MinLength } from "class-validator";

@InputType()

export class UpdateUserInput extends PartialType(CreateUserInput){
  @Field(() => String, { nullable: true })   @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string | undefined;

}