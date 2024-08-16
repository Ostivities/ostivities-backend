import { Mongoose } from 'mongoose';
import { GuestSchema } from './schema/guests.schema';

export const guestProviders = [
  {
    provide: 'GUESTS_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Guests', GuestSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
