import { Module, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@ApiTags('Event Service')
@UseGuards(JwtAuthGuard)
@Module({
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
