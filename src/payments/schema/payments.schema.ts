import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Events } from '../../event/schema/event.schema';
import { User } from '../../auth/schema/auth.schema';
import { schemaConfig } from '../../util/schema.config';

export type PaymentDocument = HydratedDocument<Payments>;

@Schema(schemaConfig)
export class Payments {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Events.name,
    required: true,
  })
  event: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  amount: string;

  @Prop({
    required: true,
    type: String,
  })
  payment_reference: string;

  @Prop({
    type: String,
    required: [true, 'status is required'],
    enum: {
      values: ['pending', 'success', 'failed'],
      message: '{VALUE} is not supported',
    },
  })
  status: string;

  @Prop({
    type: Object,
    required: false,
  })
  meta_data: Record<string, any>;
}

export const PaymentsSchema = SchemaFactory.createForClass(Payments);
