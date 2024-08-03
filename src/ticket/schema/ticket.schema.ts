import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import {
  CollectiveEvents,
  Events,
  SingleEvents,
} from 'src/event/schema/event.schema';
import { schemaConfig } from 'src/util/schema.config';

export type UserDocument = HydratedDocument<Ticket>;

@Schema(schemaConfig)
export class Ticket {
  @Prop({
    required: false,
    type: [SingleEvents],
    default: [],
  })
  singleTicket: SingleEvents[];

  @Prop({ required: false, type: [CollectiveEvents], default: [] })
  collectiveTicket: CollectiveEvents[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Events.name })
  event: mongoose.Schema.Types.ObjectId;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
