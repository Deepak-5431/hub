// users/users.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { UserResponseDto } from "./dto/responses/user-response.dto";
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from "./dto/requests/update-user.input";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateUserInput } from "src/auth/dto/requests/create-user.input";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput): Promise<UserResponseDto> {
    console.log('Creating user with email:', createUserInput.email);
    
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserInput.email }
    });

    if (existingUser) {
      console.log('User already exists:', createUserInput.email);
      throw new ConflictException("User with this email already exists");
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(createUserInput.password, 12);

    console.log('Creating user in database...');
    const user = await this.prisma.user.create({
      data: {
        email: createUserInput.email,
        password: hashedPassword,
        name: createUserInput.name || null,
        
      }
    });

    console.log('User created successfully:', user.id);
    return UserResponseDto.fromUser(user);
  }

  async findOne(email: string): Promise<UserResponseDto> {
    console.log('Finding user by email:', email);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new NotFoundException("User not found");
    }
    
    return UserResponseDto.fromUser(user);
  }

  async findById(id: string): Promise<UserResponseDto> {
    console.log('Finding user by ID:', id);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserResponseDto.fromUser(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    console.log('Finding all users');
    const users = await this.prisma.user.findMany();
    return users.map(user => UserResponseDto.fromUser(user));
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserInput,
    isAdmin: boolean = false
  ): Promise<UserResponseDto> {
    console.log('Updating user:', userId);
    
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId } 
    });
    
    if (!user) throw new NotFoundException("User not found");

    const updatePayload: any = { 
      updatedAt: new Date(),
      ...updateData
    };

    // Don't update password through this method unless explicitly provided
    if (updatePayload.password) {
      updatePayload.password = await bcrypt.hash(updatePayload.password, 12);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updatePayload,
    });

    return UserResponseDto.fromUser(updatedUser);
  }

  async changePassword(
    userId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<UserResponseDto> {
    console.log('Changing password for user:', userId);
    
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId } 
    });
    
    if (!user) throw new NotFoundException('User not found');

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date()
      },
    });

    return UserResponseDto.fromUser(updatedUser);
  }
}