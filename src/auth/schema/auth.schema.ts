import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Events } from 'src/event/schema/event.schema';
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
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          v,
        );
      },
      message: (props: { value: any }) =>
        `${props.value} is not a valid email address!`,
    },
  })
  email: string;

  @Prop({
    required: [true, 'password is required'],
  })
  hash: string;

  @Prop({
    // required: [
    //   this.accountType === ACCOUNT_TYPE.PERSONAL,
    //   'first name is required',
    // ],
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
    // required: [, 'last name is required'],
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
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Events?.name }],
  })
  events: [Events];
}

export const UserSchema = SchemaFactory.createForClass(User);
