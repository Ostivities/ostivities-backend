import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Events } from 'src/event/schema/event.schema';
import { Ticket } from 'src/ticket/schema/ticket.schema';
import { emailRegExp } from 'src/util/helper';
import { schemaConfig } from 'src/util/schema.config';
import { PAYMENT_METHODS } from 'src/util/types';

export type GuestDocument = HydratedDocument<Guests>;

@Schema(schemaConfig)
class PersonalInformation {
  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    unique: true,
    required: [true, 'email is required'],
    validate: {
      validator: function (v: string) {
        return emailRegExp.test(v);
      },
      message: (props: { value: any }) =>
        `${props.value} is not a valid email address!`,
    },
  })
  email: string;

  @Prop({
    type: Boolean,
    required: [true, 'terms and condition is required'],
  })
  terms_and_condition: boolean;

  @Prop({
    type: String,
    required: true,
  })
  phoneNumber: string;
}

@Schema(schemaConfig)
export class Guests {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Events.name,
    required: true,
  })
  event: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Ticket.name,
    required: true,
  })
  ticket: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: PersonalInformation,
  })
  personal_information: PersonalInformation;

  @Prop({
    required: true,
    type: Number,
  })
  fees: number;

  @Prop({
    required: true,
    type: Number,
  })
  total_amount_paid: number;

  @Prop({
    required: false,
    type: String,
  })
  disocuntCode: string;

  @Prop({
    required: false,
    type: Number,
    default: 1,
  })
  quantity: number;

  @Prop({
    required: false,
    type: Number,
  })
  orderNo: number;

  @Prop({
    required: true,
    enum: {
      values: [PAYMENT_METHODS.TRANSFER, PAYMENT_METHODS.CARD],
      message: '{VALUE} is not supported',
    },
  })
  payment_method: PAYMENT_METHODS;
}

export const GuestSchema = SchemaFactory.createForClass(Guests);
