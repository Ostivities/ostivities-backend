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

export type EventDocument = HydratedDocument<Events>;

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
export class Events {
  @Prop({ default: () => new mongoose.Types.ObjectId().toString() })
  _id: string;

  @Prop({ default: Date.now })
  createdAt: Date;

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
    required: [false, 'event url is required'],
    type: String,
  })
  eventURL?: string;

  @Prop({
    required: [false, 'event url is required'],
    type: SupportingDocs,
  })
  supportingDocument?: ISupportDocuments;

  @Prop({
    required: false,
    enum: {
      values: [
        'Wedding',
        'Birthday party',
        'Hangout',
        'Paint & Sip',
        'Music Show',
        'Hangouts',
        'Others',
      ],
    },
    type: String,
  })
  eventType?: EVENT_TYPES;

  @Prop({ required: false, type: String })
  timeZone?: string;

  @Prop({ required: false, type: String })
  frequency?: string;

  @Prop({ required: false, type: String })
  startDate?: string;

  @Prop({ required: false, type: String })
  endDate?: string;

  @Prop({ required: false, type: [Socials], default: [] })
  socials?: ISocials[];

  @Prop({
    required: false,
    type: String,
  })
  eventImage?: string;

  @Prop({
    required: false,
    type: {},
    default: {},
  })
  evenTicket?: {
    singleTicket?: ISingleEvents;
    collectiveTicket?: ICollectiveEvents;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  owner: User;
}

export const EventSchema = SchemaFactory.createForClass(Events);
