import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { Vendor } from './vendor.provider';
import { VendorService } from './vendor.service';

@Module({
  controllers: [VendorController],
  providers: [VendorService, Vendor],
})
export class VendorModule {}
