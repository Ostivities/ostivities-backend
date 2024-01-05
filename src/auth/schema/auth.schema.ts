import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum ACCOUNT_TYPE {
  PERSONAL = 'PERSONAL',
  ORGANISATION = 'ORGANISATION',
}

@Schema()
export class User extends Document {
  @Prop({ default: () => new mongoose.Types.ObjectId().toString() })
  _id: string;

  @Prop({ default: Date.now })
  createdAt: Date;

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
    validate: {
      validator: function (v: string) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          v,
        );
      },
      message: (props: { value: any }) =>
        `${props.value} must contain Min of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
    },
  })
  hash: string;

  @Prop({
    required: [true, 'first name is required'],
    validate: {
      validator: (value: string) => /^[A-Za-z]+$/.test(value),
      message: 'First name must only contain alphabetic characters',
    },
  })
  firstName: string;

  @Prop({
    required: [true, 'last name is required'],
    validate: {
      validator: (value: string) => /^[A-Za-z]+$/.test(value),
      message: 'Last name must only contain alphabetic characters',
    },
  })
  lastName: string;

  @Prop({
    type: String,
    required: [true, 'account type is required'],
    enum: {
      values: ['PERSONAL', 'ORGANISATION'],
      message: '{VALUE} is not supported',
    },
  })
  accountType: ACCOUNT_TYPE;
}

export const UserSchema = SchemaFactory.createForClass(User);
