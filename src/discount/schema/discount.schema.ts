import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { schemaConfig } from 'src/util/schema.config';
import { DISCOUNT_TYPES } from 'src/util/types';

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
  discountType: string;

  @Prop({
    required: [true, 'discount type is required'],
    type: String,
  })
  applicableTicket: [];
}

export const DiscountsSchema = SchemaFactory.createForClass(Discounts);
