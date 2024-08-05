import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { schemaConfig } from 'src/util/schema.config';

export type UserDocument = HydratedDocument<SettlementAccount>;

@Schema(schemaConfig)
export class SettlementAccount {
  @Prop({
    type: String,
    required: [false, 'account name is required'],
    default: '',
  })
  account_name: string;

  @Prop({
    type: String,
    required: [false, 'account number is required'],
    default: '',
  })
  account_number: string;

  @Prop({
    type: String,
    required: [false, 'bank code is required'],
    default: '',
  })
  bank_code: string;

  @Prop({
    type: String,
    required: [false, 'bank name is required'],
    default: '',
  })
  bank_name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  user: mongoose.Schema.Types.ObjectId;
}

export const SettlementAccountSchema =
  SchemaFactory.createForClass(SettlementAccount);

// account_name: 'WOODCORE POOLER SETTLEMENT CLIENT';
// account_number: '0113375218';
// bank_code: '000013';
// bank_name: 'GTBank';
