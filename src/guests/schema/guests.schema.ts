import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
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
class AttendeesInformation {
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
    required: [false, 'email is required'],
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
    type: String,
    required: false,
  })
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Ticket.name })
  ticket: mongoose.Schema.Types.ObjectId;
}

@Schema(schemaConfig)
export class AdditionalInformation {
  @Prop({ type: String, required: false })
  question: string;

  @Prop({ type: String, required: false })
  answer: string;
}

export class TicketInformation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Ticket.name,
    required: true,
  })
  ticket_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  ticket_name: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  total_amount: number;
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
    type: String,
    required: true,
  })
  event_unique_code: string;

  @Prop({
    type: [TicketInformation],
    required: true,
    default: [],
  })
  ticket_information: TicketInformation[];

  @Prop({
    required: true,
    type: PersonalInformation,
  })
  personal_information: PersonalInformation;

  @Prop({
    required: false,
    type: [AttendeesInformation],
    default: [],
  })
  attendees_information: AttendeesInformation[];

  @Prop({
    required: false,
    type: [AdditionalInformation],
  })
  additional_information: AdditionalInformation[];

  @Prop({
    required: false,
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
  discountCode: string;

  @Prop({
    required: true,
    type: Number,
  })
  order_number: string;

  @Prop({
    required: true,
    type: Number,
  })
  total_purchased: number;

  @Prop({
    required: true,
    enum: {
      values: [
        PAYMENT_METHODS.TRANSFER,
        PAYMENT_METHODS.CARD,
        PAYMENT_METHODS.FREE,
      ],
      message: '{VALUE} is not supported',
    },
  })
  payment_method: PAYMENT_METHODS;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;
}

export const GuestSchema = SchemaFactory.createForClass(Guests);
