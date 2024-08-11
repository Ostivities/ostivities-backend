import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IResponse } from 'src/util/types';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { TicketService } from './ticket.service';

@UseGuards(JwtAuthGuard)
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
  @Post('create_ticket')
  async createTicket(
    @Body() dto: CreateTicketDto,
    @GetCurrentUser('id') id: string | any,
  ): Promise<IResponse> {
    try {
      const data = await this.ticketService.createTicket({
        ...dto,
        user: id?._id,
      });
      return {
        statusCode: HttpStatus.CREATED,
        data: data,
        message: 'ticket created successfully',
      };
    } catch (error) {
      return error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiBody({ type: UpdateTicketDto })
  @ApiResponse({
    status: 200,
    description: 'Ticket updated successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('update_ticket/:id')
  async updateTicket(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @GetCurrentUser('id') userId: string | any,
  ): Promise<IResponse> {
    try {
      const data = await this.ticketService.updateTicketById(id, {
        ...dto,
        user: userId?._id,
      });
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      return error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ticket' })
  @ApiParam({ name: 'id', description: 'Ticket id' })
  @ApiResponse({
    status: 200,
    description: 'Ticket retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get_ticket/:id')
  async getTicket(@Param('id') id: string): Promise<IResponse> {
    try {
      const data = await this.ticketService.getTicketById(id);
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      return error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ticket' })
  @ApiParam({ name: 'id', description: 'Event id' })
  @ApiResponse({
    status: 200,
    description: 'Tickets retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get_event_ticket/:id')
  async getTicketsByEventId(@Param('id') id: string): Promise<IResponse> {
    try {
      const data = await this.ticketService.getTicketsByEventId(id);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Tickets fetched successfully',
      };
    } catch (error) {
      return error;
    }
  }
}
