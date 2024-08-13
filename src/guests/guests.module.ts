import { Module } from '@nestjs/common';
import { GuestsController } from './guests.controller';
import { Guests } from './guests.provider';
import { GuestsService } from './guests.service';

@Module({
  providers: [GuestsService, Guests],
  controllers: [GuestsController],
})
export class GuestsModule {}
