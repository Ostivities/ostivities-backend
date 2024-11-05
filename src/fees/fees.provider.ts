import { Mongoose } from 'mongoose';
import { FeesSchema } from './schema/fees.schema';

export const feesProviders = [
  {
    provide: 'FEES_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Fees', FeesSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
