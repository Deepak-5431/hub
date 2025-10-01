import { Injectable,ConflictException,NotFoundException,BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "./dto/requests/create-user.dto";
import { UserResponseDto } from "./dto/responses/user-response.dto";
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from "./dto/requests/update-user.input";
import { User } from "@prisma/client";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateUserInput } from "src/auth/dto/requests/create-user.input";


@Injectable()
export class UsersService{
  constructor(private prisma: PrismaService){}

  async create(createUserInput: CreateUserInput): Promise<UserResponseDto>{
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserInput.email}
    });

    if(existingUser){
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

  async findOne(email: string): Promise<UserResponseDto > {
    const user = await this.prisma.user.findUnique({
      where: {email},
    });
    if(!user){
      throw new NotFoundException("email not there")
    }
    return  UserResponseDto.fromUser(user);
  }

  async findById(id: string): Promise<UserResponseDto >{
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

  async updateUser(
    userId: string,
    updateData: UpdateUserInput,
    isAdmin: boolean = false):
  Promise<UserResponseDto>{
    const user = await this.prisma.user.findUnique({ where: { id: userId}});
    if(!user) throw new NotFoundException("user is missing");


    const updatepayload: any = { updatedAt: new Date()};

    const updatedUser = await this.prisma.user.update({
      where: { id: userId},
      data: updatepayload,
    })

    return UserResponseDto.fromUser(updatedUser);
  }

  async changePassword(userId: string,currentPassword: string, newPassword: string): Promise<UserResponseDto>{
    const user = await this.prisma.user.findUnique({where : {id: userId}});
    if(!user) throw new NotFoundException('user not found');
  
 const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

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