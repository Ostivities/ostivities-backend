import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IResponse } from 'src/util/types';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
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
    const data = await this.eventService.createEvent({ ...dto, user: id });
    return { statusCode: HttpStatus.CREATED, data: data, message: 'Success' };
  }

  @Get('retrieve_events')
  async getAllEvents(): Promise<IResponse> {
    const data = await this.eventService.getEvents();
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @Get('retrieve_event/:id')
  async getEvent(@Param('id') id: string): Promise<IResponse> {
    const data = await this.eventService.getEventsById(id);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @Put('update_event/:id')
  async updateEvent(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<IResponse> {
    const data = await this.eventService.updateEventById(id, dto);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @Delete('delete_event/:id')
  async deleteEvent(@Param('id') id: string): Promise<IResponse> {
    const data = await this.eventService.deleteEventsById(id);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @Delete('delete_events')
  async deleteManyEvents(@Body() ids: string[]): Promise<IResponse> {
    const data = await this.eventService.deleteManyEventsById(ids);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }
}
