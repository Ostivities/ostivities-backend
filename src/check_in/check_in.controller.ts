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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScannerJwtAuthGuard } from '../auth/guard/scanner-auth.guard';
import { CheckInDto } from './dto/check_in.dto';

@Controller('check_in')
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

  @UseGuards(ScannerJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get guest info and ticket information' })
  @ApiResponse({
    status: 200,
    description: 'Guest info successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':event_id/:guest_id/:order_number')
  async getGuestsTicketInformation(
    @Param('event_id') eventId: string,
    @Param('guest_id') guestId: string,
    @Param('order_number') orderNumber: string,
  ) {
    try {
      const data = await this.checkInService.getGuestsTicketInformation(
        eventId,
        guestId,
        orderNumber,
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

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check in guest' })
  @ApiResponse({
    status: 200,
    description: 'Guest checked in successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(ScannerJwtAuthGuard)
  @Post(':event_id/:guest_id/:order_number')
  async checkInGuest(
    @Param('event_id') eventId: string,
    @Param('guest_id') guestId: string,
    @Param('order_number') orderNumber: string,
    @Body() dto: CheckInDto,
  ) {
    try {
      const data = await this.checkInService.CheckInGuest(
        eventId,
        guestId,
        orderNumber,
        dto,
      );
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Guest checked in successfully',
      };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
