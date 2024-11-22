import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import {
  SettlementDto,
  UpdateSettlementDto,
  ValidateAccountDto,
} from './dto/settlement.dto';
import { SettlementAccount } from './schema/settlement.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IBanks } from '../util/types';

@Injectable()
export class SettleAccountsService {
  constructor(
    @InjectModel(SettlementAccount.name)
    private settlementModel: Model<SettlementAccount>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly httpService: HttpService,
  ) {}

  async createSettleAccount(dto: SettlementDto): Promise<SettlementAccount> {
    const { user } = dto;
    const userData = await this.userModel.findById(user);
    if (!userData) {
      throw new Error('User not found');
    }
    try {
      const settlementAccount = new this.settlementModel({
        ...dto,
        user: userData?._id,
      });
      const savedAccount = await settlementAccount.save();
      return savedAccount;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async updateSettleAccount(
    userId: string,
    dto: UpdateSettlementDto,
  ): Promise<SettlementAccount> {
    const { user } = dto;
    const userData = await this.userModel.findById(user);
    if (!userData) {
      throw new Error('User not found');
    }
    try {
      const settlement = await this.settlementModel.findOneAndUpdate(
        { user: userId },
        { ...dto },
        {
          new: true,
          useFindAndModify: false,
          runValidators: true,
          upsert: false,
        },
      );

      if (!settlement) {
        throw new NotFoundException(`Settlement account for user  not found`);
      }
      return settlement;
    } catch (error) {
      console.log(error, 'error');
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getSettleAccount(userId: string): Promise<SettlementAccount> {
    try {
      const settlement = await this.settlementModel
        .findOne({ user: userId })
        .exec();

      if (!settlement) {
        throw new NotFoundException(`Settlement account for user  not found`);
      }
      return settlement;
    } catch (error) {
      console.log(error, 'error');
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getBanks() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${process.env.OSTIVITIES_PAYSTACK_API_BASE_URL}/bank?country=nigeria`,
          {
            headers: {
              Authorization: `Bearer ${process.env.OSTIVITIES_PAYSTACK_SECRET_KEY}`,
            },
          },
        ),
      );

      const result = data?.data?.map((i: IBanks) => ({
        name: i.name,
        code: i.code,
      }));

      return result;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  async validateAccountNumber(dto: ValidateAccountDto) {
    console.log(dto, 'dto');
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${process.env.OSTIVITIES_PAYSTACK_API_BASE_URL}/bank/resolve?account_number=${dto.account_number}&bank_code=${dto.bank_code}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.OSTIVITIES_PAYSTACK_SECRET_KEY}`,
            },
          },
        ),
      );

      return data;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
