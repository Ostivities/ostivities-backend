import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { schemaConfig } from 'src/util/schema.config';
import {
  EVENT_MODE,
  EVENT_TYPES,
  ISupportDocuments,
  TICKET_STOCK,
  TICKET_TYPE,
} from 'src/util/types';

export type EventDocument = HydratedDocument<Events>;

@Schema(schemaConfig)
class TicketQuestionSchema {
  @Prop({
    type: String,
    required: true,
  })
  question: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  isCompulsory: boolean;
}

@Schema(schemaConfig)
class Socials {
  @Prop()
  name: string;

  @Prop()
  url: string;
}

@Schema(schemaConfig)
class SupportingDocs {
  @Prop()
  fileName: string;

  @Prop()
  fileUrl: string;
}

@Schema(schemaConfig)
export class SingleEvents {
  @Prop({
    type: String,
    required: [true, 'ticket type is required'],
    enum: {
      values: ['FREE', 'PAID'],
      message: '{VALUE} is not supported',
    },
  })
  ticketType: string;

  @Prop({ type: String, required: [true, 'ticket name is required'] })
  ticketName: string;

  @Prop({
    type: String,
    required: [true, 'ticket stock is required'],
    enum: {
      values: ['LIMITED', 'UN_LIMITED'],
      message: '{VALUE} is not supported',
    },
  })
  ticketStock: string;

  @Prop({
    type: Number,
    validate: {
      validator: function (value: string) {
        return this.ticketStock === TICKET_STOCK.LIMITED ? !!value : true;
      },
      message: 'ticket qty is required',
    },
  })
  ticketQty: number;

  @Prop({
    type: Number,
    validate: {
      validator: function (value: string) {
        return this.ticketPrice === TICKET_TYPE.PAID ? !!value : true;
      },
      message: 'ticket price is required',
    },
  })
  ticketPrice: number;

  @Prop({
    type: Number,
    validate: {
      validator: function (value: string) {
        return this.ticketStock === TICKET_STOCK.LIMITED ? !!value : true;
      },
      message: 'ticket price is required',
    },
  })
  purchaseLimit: number;

  @Prop({
    type: String,
    required: [false, 'ticket description is required'],
  })
  ticketDescription: string;

  @Prop({
    type: Boolean,
    required: [false, 'charge bearer is required'],
  })
  guestAsChargeBearer: boolean;

  @Prop({
    type: [TicketQuestionSchema],
    required: [false],
  })
  ticketQuestions: [TicketQuestionSchema];

  @Prop({
    type: String,
    required: [true, 'ticket stock is required'],
    enum: {
      values: ['SINGLE', 'COLLECTIVE'],
      message: '{VALUE} is not supported',
    },
  })
  ticketEntity: string;
}

@Schema(schemaConfig)
export class CollectiveEvents {
  @Prop({
    type: String,
    required: [true, 'ticket type is required'],
    enum: {
      values: ['FREE', 'PAID'],
      message: '{VALUE} is not supported',
    },
  })
  ticketType: string;

  @Prop({ type: String, required: [true, 'ticket name is required'] })
  ticketName: string;

  @Prop({
    type: String,
    required: [true, 'ticket stock is required'],
    enum: {
      values: ['LIMITED', 'UN_LIMITED'],
      message: '{VALUE} is not supported',
    },
  })
  ticketStock: string;

  @Prop({
    type: Number,
    validate: {
      validator: function (value: string) {
        return this.ticketStock === TICKET_STOCK.LIMITED ? !!value : true;
      },
      message: 'ticket qty is required',
    },
  })
  ticketQty: number;

  @Prop({
    type: Number,
    validate: {
      validator: function (value: string) {
        return this.ticketPrice === TICKET_TYPE.PAID ? !!value : true;
      },
      message: 'ticket qty is required',
    },
  })
  ticketPrice: number;

  @Prop({
    type: Number,
    required: [true, 'group price is required'],
  })
  groupPrice: number;

  @Prop({
    type: Number,
    required: [true, 'group size is required'],
  })
  groupSize: number;

  @Prop({
    type: String,
    required: [false, 'ticket description is required'],
  })
  ticketDescription: string;

  @Prop({
    type: Boolean,
    required: [false, 'charge bearer is required'],
  })
  guestAsChargeBearer: boolean;

  @Prop({
    type: [TicketQuestionSchema],
    required: [false],
  })
  ticketQuestions: [TicketQuestionSchema];

  @Prop({
    type: String,
    required: [true, 'ticket stock is required'],
    enum: {
      values: ['SINGLE', 'COLLECTIVE'],
      message: '{VALUE} is not supported',
    },
  })
  ticketEntity: string;
}

@Schema(schemaConfig)
export class Events {
  @Prop({
    required: [true, 'event name is required'],
    type: String,
  })
  eventName: string;

  @Prop({
    required: [true, 'state is required'],
    type: String,
  })
  state: string;

  @Prop({
    required: [true, 'address is required'],
    type: String,
  })
  address: string;

  @Prop({
    required: false,
    type: String,
  })
  eventURL: string;

  @Prop({
    required: false,
    type: SupportingDocs,
  })
  supportingDocument: ISupportDocuments;

  @Prop({
    required: false,
    enum: EVENT_TYPES,
  })
  eventType: EVENT_TYPES;

  @Prop({ required: false, type: String })
  timeZone: string;

  @Prop({ required: false, type: String })
  frequency: string;

  @Prop({ required: false, type: String })
  startDate: string;

  @Prop({ required: false, type: String })
  endDate: string;

  @Prop({ required: false, type: [Socials], default: [] })
  socials: Socials[];

  @Prop({
    required: false,
    type: String,
  })
  eventImage: string;

  @Prop({
    required: false,
    type: [SingleEvents],
    default: [],
  })
  singleTicket: SingleEvents[];

  @Prop({ required: false, type: [CollectiveEvents], default: [] })
  collectiveTicket: CollectiveEvents[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  ticketSold: number;

  @Prop({ enum: EVENT_MODE, required: false })
  mode: EVENT_MODE;

  @Prop({ required: false, default: false })
  discover: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Events);
