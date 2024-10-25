import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Discounts } from 'src/discount/schema/discount.schema';
import { Events } from 'src/event/schema/event.schema';
import { schemaConfig } from 'src/util/schema.config';
import { TICKET_ENTITY, TICKET_STOCK, TICKET_TYPE } from 'src/util/types';

export type UserDocument = HydratedDocument<Ticket>;

@Schema(schemaConfig)
export class TicketQuestions {
  @Prop({ type: String, required: false })
  question: string;

  @Prop({ type: Boolean, required: false })
  is_compulsory: boolean;
}

@Schema(schemaConfig)
export class Ticket {
  // @Prop({
  //   required: false,
  //   type: [SingleEvents],
  //   default: [],
  // })
  // singleTicket: SingleEvents[];

  // @Prop({ required: false, type: [CollectiveEvents], default: [] })
  // collectiveTicket: CollectiveEvents[];

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

  @Prop({ type: String, required: [true, 'ticket description is required'] })
  ticketDescription: string;

  @Prop({
    type: String,
    required: [true, 'ticket entity is required'],
    enum: {
      values: [TICKET_ENTITY.SINGLE, TICKET_ENTITY.COLLECTIVE],
      message: '{VALUE} is not supported',
    },
  })
  ticketEntity: TICKET_ENTITY;

  @Prop({
    type: Number,
    validate: {
      validator: function (value: string) {
        return this.ticketStock === TICKET_STOCK.LIMITED ||
          this.ticketEntity === TICKET_ENTITY.SINGLE
          ? !!value
          : true;
      },
      message: 'purchase limit is required',
    },
  })
  purchaseLimit: number;

  @Prop({
    type: Number,
    validate: {
      validator: function (value: string) {
        return this.ticketType === TICKET_TYPE.PAID &&
          this.ticketEntity === TICKET_ENTITY.COLLECTIVE
          ? !!value
          : true;
      },
      message: 'group price is required',
      default: 0,
    },
  })
  groupPrice: number;

  @Prop({
    type: Number,
    validate: {
      validator: function (value: string) {
        return this.ticketEntity === TICKET_ENTITY.COLLECTIVE ? !!value : true;
      },
      message: 'group size is required',
    },
  })
  groupSize: number;

  @Prop({
    type: String,
    required: [true, 'ticket entity is required'],
    enum: {
      values: [TICKET_STOCK.LIMITED, TICKET_STOCK.UN_LIMITED],
      message: '{VALUE} is not supported',
    },
  })
  ticketStock: TICKET_STOCK;

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
    type: Boolean,
    required: true,
    message: 'charge bearer is required',
  })
  guestAsChargeBearer: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Events.name,
    required: true,
  })
  event: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Discounts.name,
    required: false,
  })
  discount: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: Boolean,
    required: false,
  })
  discount_applicable: boolean;

  @Prop({ required: false, type: [TicketQuestions], default: [] })
  ticketQuestions: TicketQuestions[];

  @Prop({
    required: false,
    type: String,
  })
  discountCode: string;

  @Prop({ required: false, type: Number, default: 0 })
  ticket_sold: number;

  @Prop({
    required: false,
    type: Number,
    default: function () {
      return this.ticketQty;
    },
  })
  ticket_available: number;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
