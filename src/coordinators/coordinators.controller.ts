import {
  Body,
  Controller,
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
}
