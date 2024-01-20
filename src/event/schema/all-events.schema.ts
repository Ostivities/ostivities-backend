import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import {
  EVENT_TYPES,
  ICollectiveEvents,
  ISingleEvents,
  ISocials,
  ISupportDocuments,
} from 'src/util/types';

export type EventDocument = HydratedDocument<EventsModel>;

@Schema({ _id: false })
class Socials {
  @Prop()
  name: string;

  @Prop()
  url: string;
}

@Schema({ _id: false })
class SupportingDocs {
  @Prop()
  fileName: string;

  @Prop()
  fileUrl: string;
}

@Schema()
export class EventsModel {
  @Prop()
  createdAt: Date;

  @Prop()
  eventName: string;

  @Prop()
  state: string;

  @Prop()
  address: string;

  @Prop()
  eventURL?: string;

  @Prop({ type: SupportingDocs })
  supportingDocument?: ISupportDocuments;

  @Prop()
  eventType?: EVENT_TYPES;

  @Prop()
  timeZone?: string;

  @Prop()
  frequency?: string;

  @Prop()
  startDate?: string;

  @Prop()
  endDate?: string;

  @Prop({ type: [Socials], default: [] })
  socials?: ISocials[];

  @Prop()
  eventImage?: string;

  @Prop({
    type: {},
    default: {},
  })
  evenTicket?: {
    singleTicket?: ISingleEvents;
    collectiveTicket?: ICollectiveEvents;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
  user: User;

  @Prop({ type: Number })
  ticketSold: number;
}

export const EventModelSchema = SchemaFactory.createForClass(EventsModel);
