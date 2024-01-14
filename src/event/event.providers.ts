import { Mongoose } from 'mongoose';
import { EventSchema } from './schema/event.schema';

export const eventProviders = [
  {
    provide: 'EVENT_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Events', EventSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
