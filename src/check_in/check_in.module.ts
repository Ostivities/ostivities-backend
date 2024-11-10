import { Module } from '@nestjs/common';
import { CheckInService } from './check_in.service';
import { CheckInController } from './check_in.controller';

@Module({
  providers: [CheckInService],
  controllers: [CheckInController]
})
export class CheckInModule {}
