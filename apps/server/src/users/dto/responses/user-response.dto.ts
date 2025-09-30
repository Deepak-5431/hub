

import { User } from "@prisma/client";

export class UserResponseDto{
  id:string;
  name?:string;
  email:string;
  createdAt:Date;
  updatedAt:Date;

  
static fromUser(user: User): UserResponseDto{
  const response = new UserResponseDto();
  response.id = user.id;
  response.email = user.email;
  response.createdAt = user.createdAt;
 // response.name = user.name;
  response.updatedAt = user.updatedAt;
  return response;
}
}
