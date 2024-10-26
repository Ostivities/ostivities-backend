import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { FeesController } from './fees.controller';
import { feesProviders } from './fees.provider';
import { FeesService } from './fees.service';
import { Fees, FeesSchema } from './schema/fees.schema';

@Module({
  controllers: [FeesController],
  providers: [FeesService, ...feesProviders],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Fees.name, schema: FeesSchema }]),
  ],
})
export class FeesModule {}
