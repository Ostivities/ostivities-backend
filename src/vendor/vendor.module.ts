import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.provider';

@Module({
  controllers: [VendorController],
  providers: [VendorService, Vendor]
})
export class VendorModule {}
