import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CheckInService } from './check_in.service';
import { LoginUserDto } from '../auth/dto/auth.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('check-in')
@ApiTags('Check-In Service')
export class CheckInController {
  constructor(private checkInService: CheckInService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({ summary: 'login to scanner portal' })
  @ApiResponse({
    status: 200,
    description: 'Login was successful.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('login')
  async guestCheckInLogin(@Body() dto: LoginUserDto) {
    try {
      const data = await this.checkInService.checkInLogin(dto);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Login was successful',
      };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get guest info and ticket information' })
  @ApiResponse({
    status: 200,
    description: 'Guest info successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':event_id/:guest_id/:ticket_id')
  async getGuestsTicketInformation(
    @Param('event_id') eventId: string,
    @Param('guest_id') guestId: string,
    @Param('ticket_id') ticketId: string,
  ) {
    try {
      const data = await this.checkInService.getGuestsTicketInformation(
        eventId,
        guestId,
        ticketId,
      );
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'ticket info fetched successfully',
      };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  async checkInGuest() {}
}
