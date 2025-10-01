
import { Resolver,Query,Mutation,Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UpdateUserInput } from './dto/requests/update-user.input';
import { CreateUserInput } from 'src/auth/dto/requests/create-user.input';
import { UserResponseDto } from './dto/responses/user-response.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { Public } from '../core/decorators/public.decorator';
import { UseGuards,UsePipes,ValidationPipe,ParseUUIDPipe,BadRequestException,HttpException } from '@nestjs/common';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

private toGraphQl(userDto: UserResponseDto): UserEntity{
  const entity = new UserEntity();
  entity.id = userDto.id;
  entity.email = userDto.email;
 // entity.name = userDto.name;
 entity.updatedAt = userDto.updatedAt;
 entity.createdAt = userDto.createdAt;
 return entity;
}

  private toGraphQLArray(userDtos: UserResponseDto[]): UserEntity[] {
    return userDtos.map(dto => this.toGraphQl(dto));
  }
  
  @Public()
  @Mutation(() => UserEntity)
  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ):Promise<UserEntity>{
    try{
   const userDto = await this.usersService.create(createUserInput);
   return this.toGraphQl(userDto);
    }catch(error){
      if (error instanceof HttpException) {
        throw error
    }
    throw new BadRequestException("failed to make new user");
  }

  
}

 @Query(() => UserEntity, { name: 'me' })
  @UseGuards(GqlAuthGuard)
  async getMe(@CurrentUser() user: any): Promise<UserEntity> {
    try {
      const userDto = await this.usersService.findById(user.id);
      return this.toGraphQl(userDto);
    } catch (error) {
      throw new BadRequestException('Failed to fetch user profile');
    }
  }

  @Mutation(() => UserEntity)
  @UseGuards(GqlAuthGuard)
  @UsePipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: true
  }))
  async updateMyProfile(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: any,
  ): Promise<UserEntity> {
    try {
      const userDto = await this.usersService.updateUser(user.id, updateUserInput, false);
      return this.toGraphQl(userDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Failed to update profile');
    }
  }

  @Query(() => [UserEntity], { name: 'users' })
  @UseGuards(GqlAuthGuard, AdminGuard)
  async findAll(
    @Args('skip', { nullable: true, defaultValue: 0 }) skip: number,
    @Args('take', { nullable: true, defaultValue: 10 }) take: number,
  ): Promise<UserEntity[]> {
    try {
      if (skip < 0) throw new BadRequestException('Skip cannot be negative');
      if (take < 1 || take > 100) throw new BadRequestException('Take must be between 1 and 100');
      
      const userDtos = await this.usersService.findAll();
      return this.toGraphQLArray(userDtos);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch users');
    }
  }

  @Query(() => UserEntity, { name: 'userById' })
  @UseGuards(GqlAuthGuard, AdminGuard)
  async findById(
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<UserEntity> {
    try {
      const userDto = await this.usersService.findById(id);
      return this.toGraphQl(userDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch user');
    }
  }

  @Mutation(() => UserEntity)
  @UseGuards(GqlAuthGuard, AdminGuard)
  @UsePipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: true
  }))
  async updateUser(
    @Args('userId', ParseUUIDPipe) userId: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<UserEntity> {
    try {
      const userDto = await this.usersService.updateUser(userId, updateUserInput, true);
      return this.toGraphQl(userDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  @Mutation(() => UserEntity)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string,
    @CurrentUser() user: any,
  ): Promise<UserEntity> {
    try {
      if (newPassword.length < 6) {
        throw new BadRequestException('New password must be at least 6 characters');
      }
      const userDto = await this.usersService.changePassword(user.id, currentPassword, newPassword);
      return this.toGraphQl(userDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Failed to change password');
    }
  }
}