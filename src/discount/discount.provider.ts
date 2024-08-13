import { Mongoose } from 'mongoose';
import { DiscountsSchema } from './schema/discount.schema';

export const discountProviders = [
  {
    provide: 'DISCOUNT_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Discounts', DiscountsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
