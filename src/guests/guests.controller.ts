import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GuestsService } from './guests.service';

@Controller('guests')
@ApiTags('Guest Service')
export class GuestsController {
  constructor(private guestService: GuestsService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiBody({})
  @ApiOperation({ summary: 'Register guest' })
  @ApiResponse({
    status: 201,
    description: 'Registration was successful.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('event') event: any,
    @Body('ticket') ticket: any,
  ) {
    return this.guestService.register(name, email, event, ticket);
  }
}
