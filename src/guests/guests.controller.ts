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
  ) {
    try {
      const data = await this.guestService.getGuestsByEventId(
        eventId,
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
  @ApiOperation({ summary: 'Get all guests' })
  @ApiParam({ name: 'ticket id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Guests fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('ticket/:ticketId')
  async getGuestsByTicketId(@Param('ticketId') ticketId: string) {
    console.log(ticketId);
    // try {
    //   const data = await this.guestService.getGuestsByTicketId(ticketId);
    //   return {
    //     statusCode: HttpStatus.OK,
    //     data: data,
    //     message: 'Guests fetched successful',
    //   };
    // } catch (error) {
    //   return error;
    // }
  }
}
