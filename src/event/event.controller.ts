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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IResponse } from 'src/util/types';
import {
  CreateEventDto,
  StringArrayDto,
  UpdateEventDto,
} from './dto/event.dto';
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
  @ApiParam({ name: 'id', description: 'Event ID' })
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

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('update_event/:id')
  async updateEvent(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<IResponse> {
    const data = await this.eventService.updateEventById(id, dto);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('publish_event/:id')
  async publishEvent(@Param('id') id: string): Promise<IResponse> {
    const data = await this.eventService.publishEventById(id);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delevent event by id' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('delete_event/:id')
  async deleteEvent(@Param('id') id: string): Promise<IResponse> {
    const data = await this.eventService.deleteEventsById(id);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete many events' })
  @ApiBody({ type: StringArrayDto })
  @ApiResponse({
    status: 200,
    description: 'Events deleted successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('delete_events')
  async deleteManyEvents(@Body() ids: StringArrayDto): Promise<IResponse> {
    console.log(ids, 'kk');
    const data = await this.eventService.deleteManyEventsById(ids);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }
}
