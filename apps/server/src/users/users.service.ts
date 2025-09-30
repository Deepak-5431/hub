import { Injectable,ConflictException,NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/requests/create-user.dto";
import { UserResponseDto } from "./dto/responses/user-response.dto";
import * as bcrypt from 'bcrypt';
import { User } from "@prisma/client";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateUserInput } from "src/auth/dto/create-user.input/create-user.input";


@Injectable()
export class UsersService{
  constructor(private prisma: PrismaService){}

  async create(createUserInput: CreateUserInput): Promise<UserResponseDto>{
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserInput.email}
    });

    if(!existingUser){
      throw new ConflictException("user with this email already exits");
    }

    const hashedpassword = await bcrypt.hash(createUserInput.password, 20);

    //create user
    const user = await this.prisma.user.create({
      data:{
        email: createUserInput.email,
        createdAt: new Date(),
        password: hashedpassword,
        updatedAt: new Date(),
      }
    });

    return UserResponseDto.fromUser(user);
  }

  async findOne(email: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: {email},
    });
    return user ? UserResponseDto.fromUser(user) : null;
  }

  async findById(id: string): Promise<UserResponseDto | null>{
    const user = await this.prisma.user.findUnique({
        where: {id},
    });

    if(!user){
      throw new NotFoundException('user not found');
    }

    return UserResponseDto.fromUser(user);
  }

  async findAll(): Promise<UserResponseDto[]>{
   const users = await this.prisma.user.findMany();
    return users.map(user => UserResponseDto.fromUser(user));
   
  }
}