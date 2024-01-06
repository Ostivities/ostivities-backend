import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { User } from './schema/auth.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // REGISTER USER
  async register(dto: CreateUserDto): Promise<User> {
    try {
      const checkIfUserexist = await this.userModel.findOne({
        email: dto.email,
      });

      if (checkIfUserexist) {
        throw new ConflictException('User already registered');
      }
      const hash = await argon.hash(dto.password);

      const createdUser = new this.userModel({
        firstName: dto.firstName,
        lastName: dto.lastName,
        hash: hash,
        email: dto.email,
        accountType: dto.accountType,
      });

      const savedUser = await createdUser.save();
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  // LPGIN USER
  async login(dto: LoginUserDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    const pwdMatch = await argon.verify(user.hash, dto.password);
    if (!pwdMatch) {
      // throw new ForbiddenException(`User with this credentials doesn't exist`);
      throw new BadRequestException('wrong password');
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

  // CREATE TOKEN
  async resetToken(dto: ForgotPasswordDto) {
    try {
      const user = await this.userModel.findOne({
        email: dto.email,
      });

      if (!user) {
        throw new ConflictException('User not found');
      }

      // CREATE EMAIL TOKEN
      const emailToken = (
        Math.floor(Math.random() * 900000) + 100000
      ).toString();

      return emailToken;
    } catch (error) {
      throw error;
    }
  }

  // RESET PASSWORD
  async resetPassword(dto: ResetPasswordDto) {
    try {
      const user = await this.userModel.findOne({
        email: dto.email,
      });

      if (!user) {
        throw new ConflictException('User not found');
      }

      const hash = await argon.hash(dto.password);
      const updatedUser = await this.userModel.findOneAndUpdate(
        { email: dto.email },
        { hash: hash },
        { upsert: false, new: true },
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
