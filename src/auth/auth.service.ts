import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/auth.dto';
import { User } from './schema/auth.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

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

  // async login(dto: LoginUserDto) {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email: dto.email,
  //     },
  //   });
  //   const pwdMatch = await argon.verify(user.hash, dto.password);
  //   if (!pwdMatch) {
  //     throw new ForbiddenException(`User with this credentials doesn't exist`);
  //   } else {
  //     const payload = { ...user };
  //     const secret = this.configService.get('JWT_SECRET');
  //     const token = await this.jwtService.signAsync(payload, {
  //       expiresIn: '24h',
  //       secret: secret,
  //     });
  //     return { accessToken: token };
  //   }
  // }

  async forgotPassword() {}
}
