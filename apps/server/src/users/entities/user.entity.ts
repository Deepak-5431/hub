
import { ObjectType,Field,ID } from "@nestjs/graphql";

@ObjectType()
export class UserEntity{
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({nullable: true})
  name: string;

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;
}