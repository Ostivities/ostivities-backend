import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { emailRegExp } from 'src/util/helper';
import { schemaConfig } from 'src/util/schema.config';
import { ACCOUNT_TYPE } from 'src/util/types';

export type UserDocument = HydratedDocument<User>;

@Schema(schemaConfig)
export class User {
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
    required: [true, 'password is required'],
    type: String,
  })
  hash: string;

  @Prop({
    validate: {
      validator: function (value: string) {
        return this.accountType === ACCOUNT_TYPE.PERSONAL
          ? !!value && /^[A-Za-z]+$/.test(value)
          : true;
      },
      message: 'First name must only contain alphabetic characters',
    },
  })
  firstName: string;

  @Prop({
    validate: {
      validator: function (value: string) {
        return this.accountType === ACCOUNT_TYPE.PERSONAL
          ? !!value && /^[A-Za-z]+$/.test(value)
          : true;
      },
      message: 'Last name must only contain alphabetic characters',
    },
  })
  lastName: string;

  @Prop({
    validate: {
      validator: function (value: string) {
        return this.accountType === ACCOUNT_TYPE.ORGANISATION ? !!value : true;
      },
      message: 'Business name is required for organisation accounts',
    },
  })
  businessName: string;

  @Prop({
    type: String,
    required: [true, 'account type is required'],
    enum: {
      values: ['PERSONAL', 'ORGANISATION'],
      message: '{VALUE} is not supported',
    },
  })
  accountType: ACCOUNT_TYPE;

  @Prop({
    type: Boolean,
    required: [true, 'terms and condition is required'],
  })
  terms_and_condition: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  total_number_of_events: number;

  @Prop({
    type: Number,
    default: 0,
  })
  total_number_of_tickets: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_active: boolean;

  @Prop({
    type: String,
    required: false,
  })
  image: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
