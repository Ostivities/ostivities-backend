import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IResponse } from 'src/util/types';
import { GuestDto } from './dto/guests.dto';
import { GuestsService } from './guests.service';

@Controller('guest')
@ApiTags('Guest Service')
export class GuestsController {
  constructor(private guestService: GuestsService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: GuestDto })
  @ApiOperation({ summary: 'Register guest' })
  @ApiResponse({
    status: 201,
    description: 'Registration was successful.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('register/:eventId')
  async register(
    @Param('eventId') eventId: string,
    @Body() dto: GuestDto,
  ): Promise<IResponse> {
    try {
      const data = await this.guestService.register({ ...dto, event: eventId });
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Registration was successful',
      };
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all guests' })
  @ApiParam({ name: 'event id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Guests fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('event/:eventId')
  async getGuestsByEventId(@Param('eventId') eventId: string) {
    try {
      const data = await this.guestService.getGuestsByEventId(eventId);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Guests fetched successful',
      };
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all guests' })
  @ApiParam({ name: 'ticket id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Guests fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('ticket/:ticketId')
  async getGuestsByTicketId(@Param('ticketId') ticketId: string) {
    try {
      const data = await this.guestService.getGuestsByTicketId(ticketId);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Guests fetched successful',
      };
    } catch (error) {
      return error;
    }
  }
}
