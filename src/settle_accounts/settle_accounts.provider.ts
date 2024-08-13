import { Mongoose } from 'mongoose';
import { SettlementAccountSchema } from './schema/settlement.schema';

export const settlementProviders = [
  {
    provide: 'SETTLEMENT_ACCOUNT_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('SettlementAccount', SettlementAccountSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
