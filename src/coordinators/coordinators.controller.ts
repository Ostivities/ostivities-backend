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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IResponse } from 'src/util/types';
import { CoordinatorsService } from './coordinators.service';
import { CoordinatorDto } from './dto/coordinator.dto';

@UseGuards(JwtAuthGuard)
@Controller('coordinators')
@ApiTags('Event Coordonators Service')
export class CoordinatorsController {
  constructor(private coordinatorService: CoordinatorsService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CoordinatorDto })
  @ApiOperation({ summary: 'Create Event' })
  @ApiResponse({
    status: 201,
    description: 'Staff created successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('create/:eventId')
  async createStaff(
    @Body() dto: CoordinatorDto,
    @Param('eventId') eventId: string,
    @GetCurrentUser('id') id: string,
  ): Promise<IResponse> {
    try {
      const data = await this.coordinatorService.createStaff(dto, eventId, id);
      return {
        statusCode: HttpStatus.CREATED,
        data: data,
        message: 'Staff created successfully',
      };
    } catch (error) {
      return error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Coordinator info' })
  @ApiResponse({
    status: 201,
    description: 'Staff fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('coordnator/:id')
  async getCoordinatorById(@Param('id') id: string, eventId: string) {
    try {
      const data = await this.coordinatorService.getCoordinatorById(
        id,
        eventId,
      );
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Staff fetched successfully',
      };
    } catch (error) {
      return error;
    }
  }

  @ApiOperation({ summary: 'Event Coordinators' })
  @ApiResponse({
    status: 201,
    description: 'Staffs fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('coordnators/:eventId')
  async getCoordinatorsByEventId(@Param('eventId') eventId: string) {
    try {
      const data =
        await this.coordinatorService.getCoordinatorsByEventId(eventId);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Staffs fetched successfully',
      };
    } catch (error) {
      return error;
    }
  }
}
