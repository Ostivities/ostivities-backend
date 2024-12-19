import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IResponse } from 'src/util/types';
import { GuestDto } from './dto/guests.dto';
import { GuestsService } from './guests.service';
import { BulkEmailGuestDto } from './dto/guest_bulk_email.dto';

@Controller('guest')
@ApiTags('Guest Service')
export class GuestsController {
  constructor(private guestService: GuestsService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GuestDto })
  @ApiOperation({ summary: 'Register guest' })
  @ApiResponse({
    status: 200,
    description: 'Registration was successful.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('register/:eventId')
  async register(
    @Param('eventId') eventId: string,
    @Body() dto: GuestDto,
  ): Promise<IResponse> {
    try {
      const data = await this.guestService.register(
        {
          ...dto,
          event: eventId,
        },
        eventId,
      );
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Registration was successful',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all guests' })
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
    description: `filter by guest's firstName, lastName, email and ticket_name`,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Guests fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('event/:eventId')
  async getGuestsByEventId(
    @Param('eventId') eventId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    try {
      const data = await this.guestService.getGuestsByEventId(
        eventId,
        page,
        limit,
        search,
      );
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Guests fetched successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all guests' })
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
    description: `filter by guest's firstName, lastName, email and ticket_name`,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Guests fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('event/guests/:event_unique_key')
  async getGuestsByUniqueKey(
    @Param('event_unique_key') event_unique_key: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      const data = await this.guestService.getGuestByUniquekey(
        event_unique_key,
        page,
        limit,
      );
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Guests fetched successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get guest info and ticket information' })
  @ApiResponse({
    status: 200,
    description: 'Guests fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':event_unique_key/:guest_id/:ticket_id')
  async getGuestsTicketInformation(
    @Param('event_unique_key') eventUniqueKey: string,
    @Param('guest_id') guestId: string,
    @Param('ticket_id') ticketId: string,
  ) {
    try {
      const data = await this.guestService.getGuestsTicketInformation(
        eventUniqueKey,
        guestId,
        ticketId,
      );
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Guests fetched successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Guest(s) fetched successfully.',
  })
  @ApiOperation({ summary: 'Get guest using ticket ID' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':ticket_id')
  async guestByTicketId(@Param('ticket_id') ticketId: string) {
    try {
      const data = await this.guestService.guestByTicketId(ticketId);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Guests fetched successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: BulkEmailGuestDto })
  @ApiOperation({ summary: 'Send bulk email to guest' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('bulk_email/:event_id')
  async sendEmailToGuest(
    @Param('event_id') event_id: string,
    @Body() dto: BulkEmailGuestDto,
  ) {
    try {
      const data = await this.guestService.sendEmailToGuest(event_id, dto);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Email sent successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }
}
