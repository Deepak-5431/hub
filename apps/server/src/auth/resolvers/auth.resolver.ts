// File: apps/server/src/auth/auth.resolver.ts

import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql'; 
import { AuthService } from '../services/auth.service'
import { CreateUserInput } from '../dto/requests/create-user.input';
import { LoginInput } from '../dto/requests/login.input';
import { Response } from 'express';


@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  hello() {
    return 'world!';
  }

  @Mutation(() => AuthModel)
  async signup(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Context() context: { res: Response },
  ) {
    await this.authService.signup(
      createUserInput.email,
      createUserInput.password,
      context.res,
    );
    return { message: 'Signup successful' };
  }

  @Mutation(() => AuthModel)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: { res: Response },
  ) {
    const user = await this.authService.validateUser(
      loginInput.email,
      loginInput.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    await this.authService.login(user, context.res);
    return { message: 'Login successful' };
  }
}