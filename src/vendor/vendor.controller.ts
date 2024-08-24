import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IResponse, STATUS } from 'src/util/types';
import { VendorDto } from './dto/vendor.dto';
import { VendorService } from './vendor.service';

@Controller('vendor')
@ApiTags('Vendor Service')
export class VendorController {
  constructor(private vendorService: VendorService) {}

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
  }

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
  }
}
