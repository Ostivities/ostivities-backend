import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { IResponse } from 'src/util/types';
import { CreateTicketDto } from './dto/ticket.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
@ApiTags('Ticket Service')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateTicketDto })
  @ApiOperation({ summary: 'Create ticket' })
  @ApiResponse({
    status: 201,
    description: 'Ticket created successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('create')
  async createTicket(
    @Body() dto: CreateTicketDto,
    @GetCurrentUser('id') id: string,
  ): Promise<IResponse> {
    const data = await this.ticketService.createTicket({ ...dto, userId: id });
    return { statusCode: HttpStatus.CREATED, data: data, message: 'Success' };
  }
}
