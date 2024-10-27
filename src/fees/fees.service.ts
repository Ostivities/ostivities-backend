import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeesDto } from './dto/fees.dto';
import { Fees } from './schema/fees.schema';

@Injectable()
export class FeesService {
  constructor(@InjectModel(Fees.name) private feesModel: Model<Fees>) {}

  async setFees(dto: FeesDto): Promise<Fees> {
    const fees = new this.feesModel({ ...dto });
    const savedFees = await fees.save();
    return savedFees;
  }

  async getFees(): Promise<Fees | Fees[]> {
    const fees = await this.feesModel.find().exec();
    return fees;
  }
}
