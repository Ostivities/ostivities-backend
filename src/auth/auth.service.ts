import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async register(dto: CreateUserDto) {
    await this.prisma.$connect();
    const hash = await argon.hash(dto.password);
    const checkIfUserExist = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (checkIfUserExist) {
      throw new ForbiddenException('User with these credentials already exist');
    }
    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          hash: hash,
          accountType: dto.accountType,
        },
      });
      return {
        data: user,
        message: 'Account created successfully',
        success: true,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(
          'User with these credentials already exist',
        );
      } else if (error instanceof PrismaClientValidationError) {
        throw new ForbiddenException('Invalid credentials');
      } else {
        throw error;
      }
    }
  }

  async login(dto: LoginUserDto) {
    await this.prisma.$connect();
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    const pwdMatch = await argon.verify(user.hash, dto.password);
    if (!pwdMatch) {
      throw new ForbiddenException(`User with this credentials doesn't exist`);
    } else {
      const payload = { ...user };
      const secret = this.configService.get('JWT_SECRET');
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '24h',
        secret: secret,
      });
      return { accessToken: token };
    }
  }

  async forgotPassword() {}
}
