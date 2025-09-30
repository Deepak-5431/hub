
import { InputType,Field,PartialType } from "@nestjs/graphql";
import { CreateUserInput } from "src/auth/dto/create-user.input/create-user.input";
import { IsOptional,IsString,MinLength } from "class-validator";

@InputType()

export class UpdateUser extends PartialType(CreateUserInput){
  @Field({nullable:true})
  @IsString()
  @MinLength(6)
  @IsOptional()

  password?: string | undefined;

}