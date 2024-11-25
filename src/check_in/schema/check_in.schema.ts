import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { schemaConfig } from 'src/util/schema.config';
import { emailRegExp } from '../../util/helper';
import { Ticket } from '../../ticket/schema/ticket.schema';

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
export class CheckIn {
  @Prop({
    type: [TicketInformation],
    required: true,
    default: [],
  })
  ticket_information: TicketInformation[];

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
    type: String,
    required: true,
  })
  check_in_by: string;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);
