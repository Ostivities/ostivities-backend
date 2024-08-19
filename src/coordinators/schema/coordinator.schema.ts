import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { emailRegExp } from 'src/util/helper';
import { STAFF_ROLE } from 'src/util/types';

export type CoordinatorDocument = HydratedDocument<Coordinator>;

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
    type: STAFF_ROLE,
    required: [true, 'staff role is required'],
    enum: {
      values: Object.values(STAFF_ROLE),
      message: '{VALUE} is not supported',
    },
  })
  staff_role: STAFF_ROLE;
}

export const CoordinatorSchema = SchemaFactory.createForClass(Coordinator);
