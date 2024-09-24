import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { schemaConfig } from 'src/util/schema.config';
import {
  EVENT_INFO,
  EVENT_MODE,
  EVENT_TYPE,
  EVENT_TYPES,
  EXHIBITION_SPACE,
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
export class Socials {
  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: String, required: false })
  url: string;
}

@Schema(schemaConfig)
class SupportingDocs {
  @Prop({ type: String, required: false })
  fileName: string;

  @Prop({ type: String, required: false })
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

  // @Prop({
  //   type: String,
  //   required: [true, 'ticket stock is required'],
  //   enum: {
  //     values: ['SINGLE', 'COLLECTIVE'],
  //     message: '{VALUE} is not supported',
  //   },
  // })
  // ticketEntity: string;
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
}

@Schema(schemaConfig)
export class Events {
  @Prop({
    required: [true, 'event name is required'],
    type: String,
  })
  eventName: string;

  @Prop({
    required: [true, 'event description is required'],
    type: String,
  })
  eventDetails: string;

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
    required: true,
    enum: EVENT_TYPES,
  })
  eventType: EVENT_TYPES;

  @Prop({ required: true, type: String })
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

  // @Prop({
  //   required: false,
  //   type: [SingleEvents],
  //   default: [],
  // })
  // singleTicket: SingleEvents[];

  // @Prop({ required: false, type: [CollectiveEvents], default: [] })
  // collectiveTicket: CollectiveEvents[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;

  // @Prop({
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: 'Vendor',
  //   required: false,
  // })
  // Vendors: [Vendor];

  @Prop({ type: Number, default: 0 })
  ticketSold: number;

  @Prop({ enum: EVENT_MODE, required: false })
  mode: EVENT_MODE;

  @Prop({ enum: EVENT_TYPE, required: false })
  eventMode: EVENT_TYPE;

  @Prop({ enum: EVENT_INFO, required: true })
  eventInfo: EVENT_INFO;

  @Prop({ required: false, default: false })
  discover: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  vendor_registration: boolean;

  @Prop({
    enum: EXHIBITION_SPACE,
    required: false,
  })
  exhibition_space_booking: EXHIBITION_SPACE;

  @Prop({
    type: Number,
    required: false,
  })
  space_available: number;

  @Prop({
    type: Number,
    required: false,
  })
  space_fee: number;
}

export const EventSchema = SchemaFactory.createForClass(Events);
