import {
  Body,
  Controller,
  Delete,
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
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { activationTokenTemplate } from 'src/templates/welcome';
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
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiOperation({ summary: 'Create coordinator' })
  @ApiResponse({
    status: 200,
    description: 'Staff created successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('create/:eventId')
  async createStaff(
    @Body() dto: CoordinatorDto,
    @Param('eventId') eventId: string,
  ): Promise<IResponse> {
    try {
      const data = await this.coordinatorService.createStaff(dto, eventId);
      const email: EmailDto = {
        name: dto.staff_name,
        email: dto.staff_email,
        htmlContent: activationTokenTemplate(dto.staff_name, 123456),
        subject: `Success`,
      };
      await EmailService(email);
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
  @ApiParam({ name: 'coordinatorId', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Staff fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':coordinatorId')
  async getCoordinatorById(@Param('coordinatorId') coordinatorId: string) {
    try {
      const data =
        await this.coordinatorService.getCoordinatorById(coordinatorId);
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
  @ApiParam({ name: 'eventId', description: 'Events coordinators' })
  @ApiResponse({
    status: 200,
    description: 'Staffs fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get_coordinators/:eventId')
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

  @ApiOperation({ summary: 'Delete Coordinators' })
  @ApiParam({ name: 'id', description: 'Coordinator Id' })
  @ApiResponse({
    status: 200,
    description: 'Staffs deleted successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('delete/:id')
  async deleteCoordinatorById(@Param('id') id: string) {
    try {
      const data = await this.coordinatorService.deleteCoordinatorById(id);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Staff deleted successfully',
      };
    } catch (error) {
      return error;
    }
  }
}
