import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ForgotPasswordDocument = HydratedDocument<ForgotPasswordModel>;

@Schema()
export class ForgotPasswordModel {
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

  @Prop({ default: Date.now })
  timeStamp: Date;

  @Prop({
    required: [true, 'token is required'],
  })
  token: string;
}

export const ForgotPasswordSchema =
  SchemaFactory.createForClass(ForgotPasswordModel);
