import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { schemaConfig } from 'src/util/schema.config';
import { EVENT_MODE, EVENT_TYPES, ISupportDocuments } from 'src/util/types';

export type EventDocument = HydratedDocument<Events>;

@Schema(schemaConfig)
class Socials {
  @Prop()
  name: string;

  @Prop()
  url: string;
}

@Schema(schemaConfig)
class SupportingDocs {
  @Prop()
  fileName: string;

  @Prop()
  fileUrl: string;
}

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
export class Events {
  @Prop({
    required: [true, 'event name is required'],
    type: String,
  })
  eventName: string;

  @Prop({
    required: [true, 'state is required'],
    type: String,
  })
  state: string;

  @Prop({
    required: [true, 'address is required'],
    type: String,
  })
  address: string;

  @Prop({
    required: false,
    type: String,
  })
  eventURL: string;

  @Prop({
    required: false,
    type: SupportingDocs,
  })
  supportingDocument: ISupportDocuments;

  @Prop({
    required: false,
    enum: EVENT_TYPES,
  })
  eventType: EVENT_TYPES;

  @Prop({ required: false, type: String })
  timeZone: string;

  @Prop({ required: false, type: String })
  frequency: string;

  @Prop({ required: false, type: String })
  startDate: string;

  @Prop({ required: false, type: String })
  endDate: string;

  @Prop({ required: false, type: [Socials], default: [] })
  socials: Socials[];

  @Prop({
    required: false,
    type: String,
  })
  eventImage: string;

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

  @Prop({ type: Number, default: 0 })
  ticketSold: number;

  @Prop({ enum: EVENT_MODE, required: false })
  mode: EVENT_MODE;

  @Prop({ required: false, default: false })
  discover: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Events);
