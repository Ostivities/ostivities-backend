import { Mongoose } from 'mongoose';
import { PaymentsSchema } from './schema/payments.schema';

export const paymentsProviders = [
  {
    provide: 'PAYMENTS_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Payments', PaymentsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
