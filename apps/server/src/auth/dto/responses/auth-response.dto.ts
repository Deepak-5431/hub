// auth/dto/responses/auth-response.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { UserEntity } from 'src/users/entities/user.entity';

@ObjectType()
export class AuthResponseDto {
  @Field(() => UserEntity)
  user: UserEntity;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  expiresIn: number;
}