import { Mongoose } from 'mongoose';
import { CheckInSchema } from './schema/check_in.schema';

export const checkInProviders = [
  {
    provide: 'CHECK_IN_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('CheckIn', CheckInSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
