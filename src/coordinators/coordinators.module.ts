import { Module } from '@nestjs/common';
import { CoordinatorsController } from './coordinators.controller';
import { Coordinators } from './coordinators.provider';
import { CoordinatorsService } from './coordinators.service';

@Module({
  providers: [CoordinatorsService, Coordinators],
  controllers: [CoordinatorsController],
})
export class CoordinatorsModule {}
