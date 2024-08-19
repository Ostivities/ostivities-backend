import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/util/types';
import { GuestDto } from './dto/guests.dto';
import { GuestsService } from './guests.service';

@Controller('guests')
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
  @Post('register')
  async register(@Body() dto: GuestDto): Promise<IResponse> {
    try {
      const data = await this.guestService.register(dto);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Registration was successful',
      };
    } catch (error) {
      return error;
    }
  }
}
