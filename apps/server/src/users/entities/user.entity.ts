
import { ObjectType,Field,ID } from "@nestjs/graphql";

@ObjectType()
export class UserEntity{
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

 @Field(() => String, { nullable: true })
 name?: string | null;

  @Field(() => String, { nullable: true })
  username?: string | null;

  @Field(() => String, { nullable: true })
  avatar?: string | null;

  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field(() => String, { nullable: true })
  website?: string | null;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field()
  isVerified: boolean;

  @Field()
  isPrivate: boolean;

  @Field()
  isActive: boolean;

  @Field()
  followersCount: number;

  @Field()
  followingCount: number;

  @Field()
  postsCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  lastActiveAt: Date;
}