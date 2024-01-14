import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IResponse } from 'src/util/types';
import { CreateEventDto } from './dto/event.dto';
import { EventService } from './event.service';

@UseGuards(JwtAuthGuard)
@Controller('events')
@ApiTags('Event Service')
export class EventController {
  constructor(private eventService: EventService) {}
  @Post('create')
  async createEvents(@Body() dto: CreateEventDto): Promise<IResponse> {
    const data = await this.eventService.createEvent(dto);
    console.log(data, 'data');
    return { statusCode: HttpStatus.CREATED, data: data, message: 'Success' };
  }
}
