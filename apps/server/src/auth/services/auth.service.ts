// auth/services/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from '../dto/requests/login.input';
import { CreateUserInput } from '../dto/requests/create-user.input';
import { AuthResponseDto } from '../dto/responses/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserResponseDto } from 'src/users/dto/responses/user-response.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(createUserInput: CreateUserInput): Promise<AuthResponseDto> {
    try {
      this.logger.log(`Registering user: ${createUserInput.email}`);
      
      // Validate input
      if (!createUserInput.email || !createUserInput.password) {
        throw new BadRequestException('Email and password are required');
      }

      if (createUserInput.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }

      // Create user through users service
      const user = await this.usersService.create(createUserInput);
      this.logger.log(`User registered successfully: ${user.id}`);

      // Generate tokens
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.generateAccessToken({ sub: user.id, email: user.email }),
        this.jwtService.generateRefreshToken({ sub: user.id }),
      ]);

      this.logger.log('Tokens generated successfully');

      return {
        user,
        accessToken,
        refreshToken,
        expiresIn: this.jwtService.getTokenExpiration(),
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      
      // Re-throw specific errors
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error('Unknown registration error:', error.stack);
      throw new BadRequestException('Registration failed');
    }
  }

  async login(loginInput: LoginInput): Promise<AuthResponseDto> {
    const { email, password } = loginInput;

    try {
      this.logger.log(`Login attempt for: ${email}`);

      // Use Prisma directly to get user WITH password
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        this.logger.warn(`Login failed: User not found - ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        this.logger.warn(`Login failed: Invalid password for - ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Convert to UserResponseDto WITHOUT password for response
      const userResponse = UserResponseDto.fromUser(user);

      // Generate tokens
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.generateAccessToken({ sub: user.id, email: user.email }),
        this.jwtService.generateRefreshToken({ sub: user.id }),
      ]);

      this.logger.log(`Login successful for: ${email}`);

      return {
        user: userResponse,
        accessToken,
        refreshToken,
        expiresIn: this.jwtService.getTokenExpiration(),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Login error for ${email}:`, error.stack);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    try {
      this.logger.log('Refreshing tokens');
      
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);
      const user = await this.usersService.findById(payload.sub);

      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.jwtService.generateAccessToken({ sub: user.id, email: user.email }),
        this.jwtService.generateRefreshToken({ sub: user.id }),
      ]);

      this.logger.log('Tokens refreshed successfully');

      return {
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: this.jwtService.getTokenExpiration(),
      };
    } catch (error) {
      this.logger.error('Token refresh failed:', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(res: Response): Promise<boolean> {
    this.logger.log('User logout');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return true;
  }

  setAuthCookies(res: Response, authResponse: AuthResponseDto): void {
    const isProduction = process.env.NODE_ENV === 'production';

    // Set access token cookie (short-lived)
    res.cookie('accessToken', authResponse.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: this.jwtService.getTokenExpiration() * 1000,
    });

    // Set refresh token cookie (long-lived)
    res.cookie('refreshToken', authResponse.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    this.logger.log('Auth cookies set');
  }
}