import { Mongoose } from 'mongoose';
import { CoordinatorSchema } from './schema/coordinator.schema';

export const coordinatorProviders = [
  {
    provide: 'COORDINATOR_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Coordinator', CoordinatorSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
