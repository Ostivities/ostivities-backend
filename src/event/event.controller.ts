import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateEventDto })
  @ApiOperation({ summary: 'Create Event' })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('create')
  async createEvents(
    @Body() dto: CreateEventDto,
    @GetCurrentUser('id') id: string,
  ): Promise<IResponse> {
    const data = await this.eventService.createEvent({ ...dto, user: id });
    return { statusCode: HttpStatus.CREATED, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all events' })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('retrieve_events')
  async getAllEvents(): Promise<IResponse> {
    const data = await this.eventService.getEvents();
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get event' })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
