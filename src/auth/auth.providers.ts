import { Mongoose } from 'mongoose';
import { UserSchema } from './schema/auth.schema';

export const authProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
