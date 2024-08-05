import { Mongoose } from 'mongoose';
import { SecuritySchema } from './schema/security.schema';

export const securityProviders = [
  {
    provide: 'SECURITY_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Security', SecuritySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
