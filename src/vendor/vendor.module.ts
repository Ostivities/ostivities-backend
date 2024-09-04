import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { Revoked, RevokedSchema } from 'src/auth/schema/revoked.schema';
import { DatabaseModule } from 'src/database/database.module';
import { Events, EventSchema } from 'src/event/schema/event.schema';
import { Vendor, VendorSchema } from './schema/vendor.schema';
import { VendorController } from './vendor.controller';
import { vendorProviders } from './vendor.provider';
import { VendorService } from './vendor.service';

@Module({
  controllers: [VendorController],
  providers: [VendorService, ...vendorProviders],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Vendor.name, schema: VendorSchema },
      { name: User.name, schema: UserSchema },
      { name: Events.name, schema: EventSchema },
      { name: Revoked.name, schema: RevokedSchema },
    ]),
  ],
})
export class VendorModule {}
