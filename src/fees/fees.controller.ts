import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeesDto } from './dto/fees.dto';
import { FeesService } from './fees.service';

@Controller('fees')
@ApiTags('Fees Service')
export class FeesController {
  constructor(private feesService: FeesService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: FeesDto })
  @ApiOperation({ summary: 'Create fees' })
  @ApiResponse({
    status: 200,
    description: 'Fees set successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('set')
  async setFees(@Body() dto: FeesDto) {
    try {
      const data = await this.feesService.setFees(dto);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Fees set successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get fees' })
  @ApiResponse({
    status: 200,
    description: 'Fees fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get')
  async getFees() {
    try {
      const data = await this.feesService.getFees();
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Fees fetched successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }
}
