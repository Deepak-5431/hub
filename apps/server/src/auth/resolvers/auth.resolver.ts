// auth/resolvers/auth.resolver.ts
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { LoginInput } from '../dto/requests/login.input';
import { CreateUserInput } from '../dto/requests/create-user.input';
import { RefreshTokenInput } from '../dto/requests/refresh-token.input';
import { AuthResponseDto } from '../dto/responses/auth-response.dto';
import { Public } from 'src/core/decorators/public.decorator';
import { UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Resolver(() => AuthResponseDto)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponseDto)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(
    @Args('registerInput') registerInput: CreateUserInput,
    @Context() context: { res: Response },
  ): Promise<AuthResponseDto> {
    try {
      const authResponse = await this.authService.register(registerInput);
      this.authService.setAuthCookies(context.res, authResponse);
      return authResponse;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Mutation(() => AuthResponseDto)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: { res: Response },
  ): Promise<AuthResponseDto> {
    try {
      const authResponse = await this.authService.login(loginInput);
      this.authService.setAuthCookies(context.res, authResponse);
      return authResponse;
    } catch (error) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  @Public()
  @Mutation(() => AuthResponseDto)
  async refreshTokens(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
    @Context() context: { res: Response },
  ): Promise<AuthResponseDto> {
    try {
      const authResponse = await this.authService.refreshTokens(
        refreshTokenInput.refreshToken,
      );
      this.authService.setAuthCookies(context.res, authResponse);
      return authResponse;
    } catch (error) {
      throw new BadRequestException('Token refresh failed');
    }
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: { res: Response }): Promise<boolean> {
    return this.authService.logout(context.res);
  }
}