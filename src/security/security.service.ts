import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Security } from './schema/security.schema';

@Injectable()
export class SecurityService {
  constructor(
    @InjectModel(Security.name) private securityModel: Model<Security>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getApiKeys(userId: string): Promise<Security> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    try {
      const apiKeys = await this.securityModel.findOne({ user: userId }).exec();
      return apiKeys;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
