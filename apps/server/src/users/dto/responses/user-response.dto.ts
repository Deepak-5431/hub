// users/dto/responses/user-response.dto.ts
import { User } from "@prisma/client";

export class UserResponseDto {
  id: string;
  email: string;
  name: string | null; 
  username?: string | null;
  password?: string;
  avatar?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  isVerified: boolean;
  isPrivate: boolean;
  isActive: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;

  static fromUser(user: User): UserResponseDto {
    const response = new UserResponseDto();
    response.id = user.id;
    response.email = user.email;
    response.name = user.name; 
    response.username = user.username;
    response.avatar = user.avatar;
    response.bio = user.bio;
    response.website = user.website;
    response.location = user.location;
    response.isVerified = user.isVerified;
    response.isPrivate = user.isPrivate;
    response.isActive = user.isActive;
    response.followersCount = user.followersCount;
    response.followingCount = user.followingCount;
    response.postsCount = user.postsCount;
    response.createdAt = user.createdAt;
    response.updatedAt = user.updatedAt;
    response.lastActiveAt = user.lastActiveAt;
    return response;
  }
}