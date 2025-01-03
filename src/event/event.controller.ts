import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { EVENT_MODE, EVENT_TYPES, IResponse } from 'src/util/types';
import {
  CreateEventDto,
  StringArrayDto,
  UpdateEventDiscoveryDto,
  UpdateEventDto,
  UpdateEventModeDto,
  UpdateEventRegistrationDto,
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
    try {
      const data = await this.eventService.createEvent({ ...dto, user: id });
      return { statusCode: HttpStatus.CREATED, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
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
    console.log(id, 'new id');
    try {
      const data = await this.eventService.getAllUserEventsById(
        page,
        limit,
        search,
        id,
      );
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
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
  @UseGuards(JwtAuthGuard)
  async getEvent(@Param('id') id: string): Promise<IResponse> {
    try {
      const data = await this.eventService.getEventsById(id);
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an event' })
  @ApiParam({ name: 'Unique Key', description: 'Event Unique Key' })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get_user_event_by_unique_key/:id')
  async getEventByUniqueKey(@Param('id') id: string): Promise<IResponse> {
    try {
      const data = await this.eventService.getEventsByUniqueKey(id);
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
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
      throw new ForbiddenException(error?.message);
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
  @ApiBody({ type: UpdateEventModeDto })
  @ApiOperation({ summary: 'Update event mode' })
  @ApiResponse({
    status: 200,
    description: 'Event mode updated successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('update_event_mode')
  // @UseGuards(JwtAuthGuard)
  async updateEventModeById(
    @Body() dto: UpdateEventModeDto,
  ): Promise<IResponse> {
    try {
      const data = await this.eventService.updateEventModeById(dto);
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
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
  @ApiBody({ type: UpdateEventDiscoveryDto })
  @ApiOperation({ summary: 'update event in discovery' })
  @ApiResponse({
    status: 200,
    description: 'success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('update_event_discovery')
  // @UseGuards(JwtAuthGuard)
  async updateDiscoveryStatus(
    @Body() dto: UpdateEventDiscoveryDto,
  ): Promise<any> {
    try {
      const data = await this.eventService.updateDiscoveryStatus(dto);
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Discover events' })
  @ApiQuery({ name: 'eventName', required: false, type: String })
  @ApiQuery({ name: 'eventCat', required: false, enum: EVENT_TYPES })
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
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('eventName') eventName?: string,
    @Query('state') state?: string,
    @Query('eventCat') eventCat?: EVENT_TYPES,
  ): Promise<IResponse> {
    try {
      const data = await this.eventService.discoverEvents(
        page,
        pageSize,
        eventName,
        state,
        eventCat,
      );
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
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
  @ApiBody({ type: UpdateEventRegistrationDto })
  @ApiOperation({ summary: 'Update event registration' })
  @ApiResponse({
    status: 200,
    description: 'Event registration updated successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('update_event_registration')
  @UseGuards(JwtAuthGuard)
  async updateEventRegistration(
    @Body() dto: UpdateEventRegistrationDto,
  ): Promise<IResponse> {
    try {
      const data = await this.eventService.updateEventRegistration(dto);
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
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
    try {
      const data = await this.eventService.deleteManyEventsById(ids);
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'check in summary' })
  @ApiResponse({
    status: 200,
    description: 'success.',
  })
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
    description:
      'search by ticket name, checked in by, guest first name, guest lastname, guest email, guest checked in date',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(JwtAuthGuard)
  @Get('check_in_summary/:event_id')
  async checkInSummary(
    @Param('event_id') eventId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: number,
  ) {
    try {
      const data = await this.eventService.getEventsCheckInSummary(
        page,
        limit,
        eventId,
        search,
      );
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }
}
