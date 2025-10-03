// users/dto/responses/user-response.dto.ts
import { User } from "@prisma/client";

export class UserResponseDto{
  id:string;
  email:string;
  createdAt:Date;
  updatedAt:Date;
  password?: string; // ADD THIS - for internal auth use only

  static fromUser(user: User): UserResponseDto{
    const response = new UserResponseDto();
    response.id = user.id;
    response.email = user.email;
    response.createdAt = user.createdAt;
    response.updatedAt = user.updatedAt;
    response.password = user.password; // ADD THIS
    return response;
  }
}