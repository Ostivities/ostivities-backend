import { Mongoose } from 'mongoose';
import { VendorSchema } from './schema/vendor.schema';

export const vendorProviders = [
  {
    provide: 'VENDOR_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Vendor', VendorSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
