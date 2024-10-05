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
import { EVENT_MODE, EVENT_MODES, IResponse } from 'src/util/types';
import {
  CreateEventDto,
  StringArrayDto,
  UpdateEventDto,
} from './dto/event.dto';
import { EventService } from './event.service';

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
  @UseGuards(JwtAuthGuard)
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
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'search',
  })
  @Get('get_user_events')
  @UseGuards(JwtAuthGuard)
  async getAllUserEvents(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @GetCurrentUser('id') id: string,
  ): Promise<IResponse> {
    try {
      const data = await this.eventService.getAllUserEventsById(
        page,
        limit,
        search,
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
  @UseGuards(JwtAuthGuard)
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

  // @Put('publish_event/:id')
  // async publishEvent(@Param('id') id: string): Promise<IResponse> {
  //   const data = await this.eventService.publishEventById(id);
  //   return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  // }

  // @Put('unpublish_event/:id')
  // async unpublishEvent(@Param('id') id: string): Promise<IResponse> {
  //   const data = await this.eventService.unpublishEventById(id);
  //   return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  // }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update event mode' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({ enum: EVENT_MODE })
  @ApiResponse({
    status: 200,
    description: 'success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('update_event_mode/:id')
  @UseGuards(JwtAuthGuard)
  async updateEventModeById(
    @Param('id') id: string,
    @Body() mode: EVENT_MODE,
  ): Promise<IResponse> {
    const data = await this.eventService.updateEventModeById(id, mode);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'close event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({ enum: EVENT_MODE })
  @ApiResponse({
    status: 200,
    description: 'success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('close_event/:id')
  @UseGuards(JwtAuthGuard)
  async closeEventModeById(@Param('id') id: string): Promise<IResponse> {
    const data = await this.eventService.closeEventModeById(id);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Add event to discovery' })
  // @ApiParam({ name: 'id', description: 'Event ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'success.',
  // })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Put('add_to_discovery/:id')
  // async addEventToDiscovery(@Param('id') id: string): Promise<IResponse> {
  //   const data = await this.eventService.addToDiscovery(id);
  //   return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  // }

  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Remove event from discovery' })
  // @ApiParam({ name: 'id', description: 'Event ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'success.',
  // })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Put('remove_discovery/:id')
  // async removeEventFromDiscovery(@Param('id') id: string): Promise<any> {
  //   const data = await this.eventService.removeFromDiscovery(id);
  //   return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  // }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update event in discovery' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('update_event_discovery/:id')
  @UseGuards(JwtAuthGuard)
  async updateDiscoveryStatus(
    @Param('id') id: string,
    @Body() discover: boolean,
  ): Promise<any> {
    const data = await this.eventService.updateDiscoveryStatus(id, discover);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Discover events' })
  @ApiQuery({ name: 'eventName', required: false, type: String })
  @ApiQuery({ name: 'eventCat', required: false, enum: EVENT_MODES })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: true, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Events listed successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('discovery')
  async discoverEvents(
    @Query('eventName') eventName?: string,
    @Query('state') state?: string,
    @Query('eventCat') eventCat?: EVENT_MODES,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<IResponse> {
    const data = await this.eventService.discoverEvents(
      page,
      pageSize,
      eventName,
      state,
      eventCat,
    );
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Delevent event by id' })
  // @ApiParam({ name: 'id', description: 'Event ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Event deleted successfully.',
  // })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Delete('delete_event/:id')
  @UseGuards(JwtAuthGuard)
  async deleteEvent(@Param('id') id: string): Promise<IResponse> {
    const data = await this.eventService.deleteEventsById(id);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete event(s)' })
  @ApiBody({ type: StringArrayDto })
  @ApiResponse({
    status: 200,
    description: 'Events deleted successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('delete_events')
  @UseGuards(JwtAuthGuard)
  async deleteManyEvents(@Body() ids: StringArrayDto): Promise<IResponse> {
    const data = await this.eventService.deleteManyEventsById(ids);
    return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
  }
}
