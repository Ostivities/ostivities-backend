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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PaginationDto } from 'src/util/dto.utils';
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
  @ApiOperation({ summary: 'List all user events' })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get_user_events')
  async getAllUserEvents(
    @Query() paginationDto: PaginationDto,
    @GetCurrentUser('id') id: string,
  ): Promise<IResponse> {
    try {
      const { page, limit } = paginationDto;
      const data = await this.eventService.getAllUserEventsById(
        page,
        limit,
        id,
      );
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      return error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get_user_event/:id')
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
    @GetCurrentUser('id') userId: string,
  ): Promise<IResponse> {
    try {
      const data = await this.eventService.updateEventById(id, userId, {
        ...dto,
      });
      return { statusCode: HttpStatus.OK, data, message: 'Success' };
    } catch (error) {
      return error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Event published successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('publish_event/:id')
  async publishEvent(@Param('id') id: string): Promise<IResponse> {
    const data = await this.eventService.publishEventById(id);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unpublish event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('unpublish_event/:id')
  async unpublishEvent(@Param('id') id: string): Promise<IResponse> {
    const data = await this.eventService.unpublishEventById(id);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add event to discovery' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('add_to_discovery/:id')
  async addEventToDiscovery(@Param('id') id: string): Promise<IResponse> {
    const data = await this.eventService.addToDiscovery(id);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove event from discovery' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('remove_discovery/:id')
  async removeEventFromDiscovery(@Param('id') id: string): Promise<any> {
    const data = await this.eventService.removeFromDiscovery(id);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Discover events' })
  @ApiQuery({ name: 'eventName', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Events listed successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('discovery')
  async discoverEvents(
    @Query('eventName') eventName?: string,
    @Query('state') state?: string,
    @Query('eventType') eventType?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<IResponse> {
    const data = await this.eventService.discoverEvents(
      eventName,
      state,
      eventType,
      page,
      pageSize,
    );
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delevent event by id' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully.',
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
    const data = await this.eventService.deleteManyEventsById(ids);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }
}
