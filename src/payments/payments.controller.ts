import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/payments.dto';

@Controller('payments')
@ApiTags('Payment Service')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: InitiatePaymentDto })
  @ApiOperation({ summary: 'initialise payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment initialised successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('initialise')
  async initiatePayment(@Body() dto: InitiatePaymentDto) {
    try {
      const data = await this.paymentService.initiatePayment(dto);
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'verify payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment verification successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('verify/:reference')
  async verifyPayment(@Param('reference') reference: string) {
    try {
      const data = await this.paymentService.validatePayment(reference);
      return { statusCode: HttpStatus.OK, data: data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }
}
