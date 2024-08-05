import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { Security } from 'src/security/schema/security.schema';
import { ACCOUNT_TYPE } from 'src/util/types';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { User } from './schema/auth.schema';
import { ForgotPasswordModel } from './schema/forgotpassword.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ForgotPasswordModel.name)
    private forgotPasswordModel: Model<ForgotPasswordModel>,
    @InjectModel(Security.name) private securityModel: Model<Security>,
  ) {}

  // REGISTER USER
  async register(dto: CreateUserDto): Promise<User> {
    const publicKey = 'pub_' + crypto.randomBytes(16).toString('hex');
    const secretKey = 'pk_' + crypto.randomBytes(32).toString('hex');

    try {
      const checkIfUserexist = await this.userModel.findOne({
        email: dto.email,
      });

      if (checkIfUserexist) {
        throw new ConflictException('User already registered');
      }
      const hash = await argon.hash(dto.password);

      let user: any;

      if (dto.accountType === ACCOUNT_TYPE.ORGANISATION) {
        user = {
          businessName: dto.businessName,
          hash: hash,
          email: dto.email,
          accountType: dto.accountType,
          terms_and_condition: dto.terms_and_condition,
        };
      }
      if (dto.accountType === ACCOUNT_TYPE.PERSONAL) {
        user = {
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash: hash,
          email: dto.email,
          accountType: dto.accountType,
          terms_and_condition: dto.terms_and_condition,
        };
      }

      const createdUser = new this.userModel({
        ...user,
      });

      const savedUser = await createdUser.save();

      if (savedUser) {
        const newSecurityKey = new this.securityModel({
          publicKey,
          secretKey,
        });

        await newSecurityKey.save();
      }
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  // ACTIVATE ACCONT
  async activateAccount(dto: any) {
    console.log(dto);
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
      const forgottenPassword: any = await this.forgotPasswordModel.findOne({
        email: dto.email,
      });

      if (forgottenPassword) {
        const currentTime = new Date().getTime();
        const forgottenPasswordTimestamp = new Date(
          forgottenPassword?.timeStamp,
        ).getTime();

        const timeDifference = Math.abs(
          currentTime - forgottenPasswordTimestamp,
        );
        const fifteenMinutesInMilliseconds = 15 * 60 * 1000;
        if (timeDifference < fifteenMinutesInMilliseconds) {
          throw new ForbiddenException('token as already been sent');
        }
      } else {
        const forgottenPasswordModelUpdate =
          await this.forgotPasswordModel.findOneAndUpdate(
            { email: dto.email },
            {
              $set: {
                email: dto.email,
                token: (Math.floor(Math.random() * 900000) + 100000).toString(),
              },
            },
            { upsert: true, new: true },
          );

        if (forgottenPasswordModelUpdate) {
          return forgottenPasswordModelUpdate;
        }
      }
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

  // GET ALL USERS
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find().populate('events').exec();
      return users;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
