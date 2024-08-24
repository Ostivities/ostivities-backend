import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
      console.log(data, 'vendor data');
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
