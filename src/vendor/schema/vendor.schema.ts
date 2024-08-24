import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Events, Socials } from 'src/event/schema/event.schema';
import { emailRegExp } from 'src/util/helper';
import { schemaConfig } from 'src/util/schema.config';
import { STATUS } from 'src/util/types';

export type VendorDocument = HydratedDocument<Vendor>;

@Schema(schemaConfig)
export class Vendor {
  @Prop({
    required: [true, 'name is required'],
    type: String,
  })
  vendor_name: string;

  @Prop({
    required: false,
    type: URL,
  })
  vendor_logo: string;

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
  vendor_email: string;

  @Prop({ required: false, type: [Socials], default: [] })
  socials: Socials[];

  @Prop({
    required: [true, 'phone number is required'],
    type: String,
  })
  vendor_phone_number: string;

  @Prop({
    required: false,
    type: String,
  })
  vendor_address: string;

  @Prop({
    required: true,
    type: String,
  })
  specialities: string;

  @Prop({
    required: false,
    type: String,
  })
  description: string;

  @Prop({
    required: false,
    type: Boolean,
  })
  exhibition_space: boolean;

  @Prop({
    required: true,
    type: String,
    enum: {
      values: Object.values(STATUS),
      message: '{VALUE} is not supported',
    },
  })
  status: STATUS;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Events.name,
    required: true,
  })
  event: mongoose.Schema.Types.ObjectId;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
