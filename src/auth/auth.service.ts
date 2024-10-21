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
import { EmailService } from 'src/email/email.service';
import { SecurityDto } from 'src/security/dto/security.dto';
import { Security } from 'src/security/schema/security.schema';
import { PasswordReset } from 'src/templates/PasswordReset';
import { VerifyAccountTemplate } from 'src/templates/verifyAcoount';
import { activationTokenTemplate } from 'src/templates/welcome';
import { otpGenerator } from 'src/util/helper';
import { ACCOUNT_TYPE } from 'src/util/types';
import {
  ActivateAccountDto,
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
  UpdatePasswordDto,
  UpdateUserDto,
  VerifyAccountDto,
} from './dto/auth.dto';
import { ActivateUser } from './schema/activation.schema';
import { User } from './schema/auth.schema';
import { ForgotPasswordModel } from './schema/forgotpassword.schema';
import { Revoked } from './schema/revoked.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ForgotPasswordModel.name)
    private forgotPasswordModel: Model<ForgotPasswordModel>,
    @InjectModel(Security.name) private securityModel: Model<Security>,
    @InjectModel(ActivateUser.name)
    private activateAccountModel: Model<ActivateUser>,
    @InjectModel(Revoked.name)
    private revokedTokenModel: Model<Revoked>,
  ) {}

  // REGISTER USER
  async register(dto: CreateUserDto): Promise<User> {
    const publicKey = 'pub_' + crypto.randomBytes(16).toString('hex');
    const secretKey = 'pk_' + crypto.randomBytes(16).toString('hex');

    if (
      dto.terms_and_condition === undefined ||
      dto.terms_and_condition === false
    ) {
      throw new BadRequestException(`Please accept terms and conditions`);
    }

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
      // 906767
      const savedUser = await createdUser.save();

      if (savedUser) {
        const security: SecurityDto = {
          publicKey,
          secretKey,
          user: savedUser?.id,
        };
        const newSecurityKey = new this.securityModel({
          ...security,
        });
        await newSecurityKey.save();
      }
      await this.generateOtp({ ...dto });
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  // GENERATE OTP
  async generateOtp(dto: ActivateAccountDto): Promise<ActivateUser> {
    const userActive: any = await this.activateAccountModel.findOne({
      email: dto.email,
    });

    if (userActive) {
      const currentTime = new Date().getTime();
      const activateAccountTimestamp = new Date(
        userActive?.timeStamp,
      ).getTime();

      const timeDifference = Math.abs(currentTime - activateAccountTimestamp);
      const fiveMinutesInMilliseconds = 5 * 60 * 1000;

      if (timeDifference <= fiveMinutesInMilliseconds) {
        throw new ForbiddenException('token already sent');
      }

      if (timeDifference > fiveMinutesInMilliseconds) {
        throw new ForbiddenException('token expired');
      }
    }
    try {
      const otp = otpGenerator();

      const name =
        dto.accountType === ACCOUNT_TYPE.PERSONAL
          ? dto.firstName
          : dto.businessName;

      const activateAccountModelUpdate =
        await this.activateAccountModel.findOneAndUpdate(
          { email: dto.email },
          {
            email: dto.email,
            otp,
          },
          { upsert: true, new: true },
        );

      if (activateAccountModelUpdate) {
        EmailService({
          subject: 'Activate account',
          htmlContent: activationTokenTemplate(name, otp),
          email: dto.email,
          name,
        });
        return activateAccountModelUpdate;
      }
    } catch (error) {}
  }

  // ACTIVATE ACCONT
  async activateAccount(dto: VerifyAccountDto): Promise<any> {
    const userActive: any = await this.activateAccountModel.findOne({
      email: dto.email,
    });

    // Check if the user exists
    if (!userActive) {
      throw new BadRequestException(`User with email ${dto.email} not found`);
    }

    // Validate OTP length
    if (dto.otp.length !== 6) {
      throw new BadRequestException('OTP must be exactly 6 characters long');
    }

    // Check if OTP matches
    if (userActive.otp !== dto.otp) {
      console.log('ddd');
      throw new BadRequestException('Incorrect OTP');
    }

    try {
      const currentTime = Date.now();
      const userActiveTimeStamp = new Date(userActive?.timeStamp).getTime();

      const fiveMinutesInMilliseconds = 5 * 60 * 1000;
      const timeDifference = currentTime - userActiveTimeStamp;

      // Check if OTP is expired
      if (timeDifference > fiveMinutesInMilliseconds) {
        throw new BadRequestException('OTP has expired');
      }

      // Activate the user's account
      const user = await this.userModel.findOneAndUpdate(
        { email: dto.email },
        { is_active: true },
        { new: true, runValidators: true },
      );

      const name =
        user.accountType === ACCOUNT_TYPE.PERSONAL
          ? user.firstName
          : user.businessName;

      // Send a welcome email
      await EmailService({
        subject: 'Welcome',
        htmlContent: VerifyAccountTemplate(name),
        email: user.email,
        name,
      });

      return { message: 'Account activated successfully' };
    } catch (error) {
      throw new ForbiddenException('Account activation failed');
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
      throw new BadRequestException('Incorrect password');
    }

    if (user.is_active === false) {
      const otp = otpGenerator();
      await this.activateAccountModel.findOneAndUpdate(
        { email: dto.email },
        {
          otp,
        },
        { upsert: true, new: true },
      );
      const name =
        user.accountType === ACCOUNT_TYPE.PERSONAL
          ? user.firstName
          : user.businessName;
      EmailService({
        subject: 'Activate account',
        htmlContent: activationTokenTemplate(name, otp),
        email: dto.email,
        name,
      });

      return { message: 'kindly verify account', is_active: false };
    } else {
      try {
        const payload = { ...user };
        const secret = this.configService.get('JWT_SECRET');
        const token = await this.jwtService.signAsync(payload, {
          expiresIn: '24h',
          secret: secret,
        });
        return { accessToken: token };
      } catch (error) {
        throw new ForbiddenException(error?.message);
      }
    }
  }

  // CREATE TOKEN
  async resetToken(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user) {
      throw new BadRequestException(`User with ${dto.email} not found`);
    }

    const forgottenPassword = await this.forgotPasswordModel.findOne({
      email: dto.email,
    });

    if (forgottenPassword) {
      const otp = otpGenerator();
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 30);
      await this.forgotPasswordModel.updateOne({
        token: otp,
        expiresAt: expiryDate,
        email: dto.email,
      });
      const name =
        user.accountType === ACCOUNT_TYPE.PERSONAL
          ? user.firstName
          : user.businessName;
      EmailService({
        subject: 'Password reset',
        htmlContent: PasswordReset(name, otp),
        email: dto.email,
        name: name,
      });
      return `OTP sent successfully to ${dto.email}`;
    } else {
      const otp = otpGenerator();
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 30);
      await new this.forgotPasswordModel({
        token: otp,
        expiresAt: expiry,
        email: dto.email,
      }).save();
      const name =
        user.accountType === ACCOUNT_TYPE.PERSONAL
          ? user.firstName
          : user.businessName;
      EmailService({
        subject: 'Password reset',
        htmlContent: PasswordReset(name, otp),
        email: dto.email,
        name: name,
      });
      return `OTP sent successfully to ${dto.email}`;
    }
  }

  // RESET PASSWORD
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user) {
      throw new BadRequestException(`User with email ${dto.email} not found`);
    }

    const forgottenPassword: any = await this.forgotPasswordModel.findOne({
      email: dto.email,
    });

    if (forgottenPassword.token !== dto.token) {
      throw new BadRequestException(`${dto.token} is not a valid token`);
    }

    const hash = await argon.hash(dto.password);
    const pwdMatch = await argon.verify(user.hash, dto.password);

    if (pwdMatch) {
      throw new BadRequestException(
        `Cannot replace password with old password`,
      );
    }

    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { email: dto.email },
        { hash: hash },
        { upsert: false, new: true },
      );

      if (updatedUser) {
        await this.forgotPasswordModel.findOneAndDelete({
          email: dto.email,
        });
      }

      return { message: 'Password changed successfully' };
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

  async getUserProfile(user: string): Promise<User> {
    try {
      const userData = await this.userModel.findById(user);
      return userData;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async updateUserProfile(dto: UpdateUserDto, userId: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        { _id: userId },
        {
          ...dto,
        },
        { new: true },
      );
      return user;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
  async updateUserPassword(
    dto: UpdatePasswordDto,
    userId: string,
  ): Promise<User> {
    const user = await this.userModel.findOne({
      _id: userId,
    });
    if (!user) {
      throw new ConflictException('User not found');
    }
    const pwdMatch = await argon.verify(user.hash, dto.old_password);
    if (!pwdMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
    if (dto.password !== dto.confirm_password) {
      throw new BadRequestException(
        'New password and confirmation do not match',
      );
    }

    const hash = await argon.hash(dto.password);

    try {
      const user = await this.userModel.findByIdAndUpdate(
        { _id: userId },
        {
          hash,
        },
        { new: true, runValidators: true, upsert: true },
      );
      return user;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async logout(token: string, expiresAt: Date): Promise<Revoked> {
    try {
      const createdRevoked = await new this.revokedTokenModel({
        token,
        expiresAt,
      }).save();
      const revoked = await createdRevoked.save();
      return revoked;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async checkIfTokenIsRevoked(token: string): Promise<boolean> {
    try {
      const tokenExists = await this.revokedTokenModel
        .findOne({ token })
        .exec();
      return !!tokenExists;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
