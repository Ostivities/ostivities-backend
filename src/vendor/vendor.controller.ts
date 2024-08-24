import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IResponse } from 'src/util/types';
import { VendorDto } from './dto/vendor.dto';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: VendorDto })
  @ApiOperation({ summary: 'Create Vendor' })
  @ApiResponse({
    status: 201,
    description: 'Vendor registered successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('register/:eventId')
  async registerVendor(
    @Body() dto: VendorDto,
    @Param('eventId') eventId: string,
  ): Promise<IResponse> {
    console.log(eventId, 'event id');
    try {
      const data = await this.vendorService.registerVendor(dto, eventId);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Vendor registered successfully.',
      };
    } catch (error) {
      return error;
    }
  }
}
