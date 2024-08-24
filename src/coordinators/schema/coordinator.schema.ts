import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Events } from 'src/event/schema/event.schema';
import { emailRegExp } from 'src/util/helper';
import { schemaConfig } from 'src/util/schema.config';
import { STAFF_ROLE } from 'src/util/types';

export type CoordinatorDocument = HydratedDocument<Coordinator>;

@Schema(schemaConfig)
export class Coordinator {
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
  staff_email: string;

  @Prop({
    required: [true, 'name is required'],
    type: String,
  })
  staff_name: string;

  @Prop({
    // type: STAFF_ROLE,
    required: [true, 'staff role is required'],
    enum: {
      values: Object.values(STAFF_ROLE),
      message: '{VALUE} is not supported',
    },
  })
  staff_role: STAFF_ROLE;

  @Prop({
    required: [true, 'phone number is required'],
    type: String,
  })
  staff_phone_number: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Events.name,
    required: true,
  })
  event: mongoose.Schema.Types.ObjectId;
}

export const CoordinatorSchema = SchemaFactory.createForClass(Coordinator);
