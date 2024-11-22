import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { schemaConfig } from 'src/util/schema.config';

export type UserDocument = HydratedDocument<SettlementAccount>;

@Schema(schemaConfig)
export class SettlementAccount {
  @Prop({
    type: String,
    required: true,
  })
  account_name: string;

  @Prop({
    type: String,
    required: true,

    unique: true,
  })
  account_number: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  bank_code: string;

  @Prop({
    type: String,
    required: true,
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
