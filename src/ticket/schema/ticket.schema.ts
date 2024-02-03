import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Events } from 'src/event/schema/event.schema';
import { schemaConfig } from 'src/util/schema.config';

export type UserDocument = HydratedDocument<Ticket>;

@Schema(schemaConfig)
class SingleEvents {
  @Prop()
  ticketType: string;

  @Prop()
  ticketName: string;

  @Prop()
  ticketStock: string;

  @Prop()
  ticketPrice: string;

  @Prop()
  purchaseLimit: number;

  @Prop()
  ticketDescription: string;
}

@Schema(schemaConfig)
class CollectiveEvents {
  @Prop()
  ticketType: string;

  @Prop()
  ticketName: string;

  @Prop()
  ticketStock: string;

  @Prop()
  groupPrice: string;

  @Prop()
  groupSize: string;

  @Prop()
  ticketPrice: string;

  @Prop()
  ticketDescription: string;
}

@Schema(schemaConfig)
export class Ticket {
  @Prop({
    required: false,
    type: SingleEvents,
    default: {},
  })
  singleTicket: SingleEvents;

  @Prop({ required: false, type: CollectiveEvents, default: {} })
  collectiveTicket: CollectiveEvents;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Events.name })
  event: mongoose.Schema.Types.ObjectId;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
