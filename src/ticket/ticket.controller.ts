import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  Headers,
  ForbiddenException,
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
import { encryptText } from '../util/helper';

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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @ApiOperation({ summary: 'Get ticket by id' })
  @ApiParam({ name: 'id', description: 'Ticket id' })
  @ApiResponse({
    status: 200,
    description: 'Ticket retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get_ticket/:id')
  @UseGuards(JwtAuthGuard)
  async getTicket(@Param('id') id: string): Promise<IResponse> {
    try {
      const data = await this.ticketService.getTicketById(id);
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      return error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List tickets of an event' })
  @ApiParam({ name: 'id', description: 'Event id' })
  @ApiResponse({
    status: 200,
    description: 'Tickets retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(JwtAuthGuard)
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

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List tickets of an event' })
  @ApiResponse({
    status: 200,
    description: 'Tickets retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get_event_tickets/:event_unique_key')
  async getTicketsByEventUniqueKey(
    @Param('event_unique_key') id: string,
    @Headers('Reference') Reference: string,
  ): Promise<IResponse> {
    try {
      if (encryptText(Reference) === false) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized request',
        };
      }
      const data = await this.ticketService.getTicketsByEventUniqueKey(id);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Tickets fetched successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete ticket by an id' })
  @ApiParam({ name: 'id', description: 'Ticket id' })
  @ApiResponse({
    status: 200,
    description: 'Ticket deleted successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('delete_ticket/:id')
  @UseGuards(JwtAuthGuard)
  async deleteTicketById(@Param('id') id: string): Promise<IResponse> {
    try {
      const data = await this.ticketService.deleteTicketById(id);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Tickets deleted successfully',
      };
    } catch (error) {
      return error;
    }
  }
}
