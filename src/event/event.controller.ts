import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
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
  async createEvents(
    @Body() dto: CreateEventDto,
    @GetCurrentUser('id') id: string,
  ): Promise<IResponse> {
    console.log(id, 'idd');
    const data = await this.eventService.createEvent({ ...dto, user: id });
    return { statusCode: HttpStatus.CREATED, data: data, message: 'Success' };
  }

  @Get('retrieve_events')
  async getAllEvents(): Promise<IResponse> {
    const data = await this.eventService.getEvents();
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }
}
