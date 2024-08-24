import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { Public } from 'src/auth/decorator/public.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IResponse, STATUS } from 'src/util/types';
import { VendorDto } from './dto/vendor.dto';
import { VendorService } from './vendor.service';

@Controller('vendor')
@ApiTags('Vendor Service')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: VendorDto })
  @ApiOperation({ summary: 'Create Vendor' })
  @ApiResponse({
    status: 200,
    description: 'Vendor registered successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('register/:eventId')
  async registerVendor(
    @Body() dto: VendorDto,
    @Param('eventId') eventId: string,
  ): Promise<IResponse> {
    try {
      const data = await this.vendorService.registerVendor(dto, eventId);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Vendor registered successfully.',
      };
    } catch (error) {
      console.log(error, 'error');
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiOperation({ summary: 'Approve Vendor' })
  @ApiResponse({
    status: 200,
    description: 'Vendor approved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Patch('approve/:eventId/:vendorId')
  async approveVendor(
    @Param('eventId') eventId: string,
    @Param('vendorId') vendorId: string,
  ) {
    try {
      const vendor = await this.vendorService.updateVendorStatus(
        eventId,
        vendorId,
        STATUS.APPROVED,
      );
      return {
        statusCode: 200,
        data: vendor,
        message: 'Vendor approved successfully.',
      };
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiOperation({ summary: 'Decline Vendor' })
  @ApiResponse({
    status: 200,
    description: 'Vendor declined successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Patch('decline/:eventId/:vendorId')
  async declineVendor(
    @Param('eventId') eventId: string,
    @Param('vendorId') vendorId: string,
  ) {
    try {
      const vendor = await this.vendorService.updateVendorStatus(
        eventId,
        vendorId,
        STATUS.DECLINED,
      );
      return {
        statusCode: 200,
        data: vendor,
        message: 'Vendor declined successfully.',
      };
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiOperation({ summary: 'Get Vendors of an event' })
  @ApiResponse({
    status: 200,
    description: 'Vendors fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':eventId')
  async getAllVendorsByEventId(@Param('eventId') eventId: string) {
    try {
      const vendor = await this.vendorService.getAllVendorsByEventId(eventId);
      return {
        statusCode: 200,
        data: vendor,
        message: 'Vendors fetched successfully.',
      };
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiOperation({ summary: 'Get vendor info' })
  @ApiResponse({
    status: 200,
    description: 'Vendor fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':vendorId')
  async getVendorById(@Param('vendorId') vendorId: string) {
    try {
      const vendor = await this.vendorService.getVendorById(vendorId);
      return {
        statusCode: 200,
        data: vendor,
        message: 'Vendor fetched successfully.',
      };
    } catch (error) {
      return error;
    }
  }
}
