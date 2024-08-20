import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Events } from 'src/event/schema/event.schema';
import { Ticket } from 'src/ticket/schema/ticket.schema';
import { schemaConfig } from 'src/util/schema.config';
import { DISCOUNT_TYPES, DISCOUNT_USAGE_LIMIT } from 'src/util/types';

export type DiscountDocument = HydratedDocument<Discounts>;

@Schema(schemaConfig)
export class Discounts {
  @Prop({
    required: [true, 'discount code is required'],
    type: String,
  })
  discountCode: string;

  @Prop({
    required: [true, 'discount type is required'],
    type: String,
    enum: {
      values: [DISCOUNT_TYPES.FIXED, DISCOUNT_TYPES.PERCENTAGE],
      message: '{VALUE} not supported',
    },
  })
  discountType: DISCOUNT_TYPES;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Ticket',
    required: true,
  })
  ticket: [Ticket];

  @Prop({
    required: [true, 'usage limit is required'],
    type: String,
    enum: {
      values: [DISCOUNT_USAGE_LIMIT.ONCE, DISCOUNT_USAGE_LIMIT.UN_LIMITED],
      message: '{VALUE} not supported',
    },
  })
  usageLimit: DISCOUNT_USAGE_LIMIT;

  @Prop({
    type: String,
    validate: {
      validator: function (value: string) {
        return this.usageLimit === DISCOUNT_USAGE_LIMIT.ONCE ? !!value : true;
      },
      message: 'start date and time is required',
    },
  })
  startDateAndTime: string;

  @Prop({
    type: String,
    validate: {
      validator: function (value: string) {
        return this.usageLimit === DISCOUNT_USAGE_LIMIT.ONCE ? !!value : true;
      },
      message: 'start date and time is required',
    },
  })
  endDateAndTime: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Events.name,
    required: true,
  })
  event: mongoose.Schema.Types.ObjectId;
}

export const DiscountsSchema = SchemaFactory.createForClass(Discounts);
