import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { schemaConfig } from 'src/util/schema.config';
import { emailRegExp } from '../../util/helper';
import { Ticket } from '../../ticket/schema/ticket.schema';
import { Events } from '../../event/schema/event.schema';
// import { User } from '../../auth/schema/auth.schema';

export type CheckInDocument = HydratedDocument<CheckIn>;

@Schema(schemaConfig)
class PersonalInformation {
  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    required: [true, 'email is required'],
    validate: {
      validator: function (v: string) {
        return emailRegExp.test(v);
      },
      message: (props: { value: any }) =>
        `${props.value} is not a valid email address!`,
    },
    unique: false,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  phoneNumber: string;
}

@Schema(schemaConfig)
class TicketInformation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Ticket.name,
    required: true,
  })
  ticket_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  ticket_name: string;

  @Prop({
    type: String,
    required: false,
  })
  ticket_type: string;

  @Prop({
    type: String,
    required: false,
  })
  order_no: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  total_amount: number;
}

@Schema(schemaConfig)
// class StaffInformation {
//   @Prop({
//     type: String,
//     required: true,
//   })
//   staff_name: string;
//
//   @Prop({
//     required: [true, 'email is required'],
//     validate: {
//       validator: function (v: string) {
//         return emailRegExp.test(v);
//       },
//       message: (props: { value: any }) =>
//         `${props.value} is not a valid email address!`,
//     },
//     unique: false,
//   })
//   email: string;
//
//   @Prop({
//     type: String,
//     required: true,
//   })
//   staff_role: string;
// }

@Schema(schemaConfig)
export class CheckIn {
  @Prop({
    type: [TicketInformation],
    required: true,
    default: [],
  })
  ticket_information: TicketInformation;

  @Prop({
    required: true,
    type: PersonalInformation,
  })
  personal_information: PersonalInformation;

  @Prop({
    type: String,
    required: true,
  })
  check_in_date_time: string;

  @Prop({
    required: false,
    type: String,
  })
  check_in_by: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Events.name,
    required: true,
  })
  event: mongoose.Schema.Types.ObjectId;

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: User.name,
  //   required: true,
  // })
  // user: mongoose.Schema.Types.ObjectId;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);
