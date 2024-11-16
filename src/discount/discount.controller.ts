import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { DiscountService } from './discount.service';
import { ApplyDiscountDto, CreateDiscountDto } from './dto/discount.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Discount Service')
@Controller('discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateDiscountDto })
  @ApiOperation({ summary: 'Create Discount' })
  @ApiResponse({
    status: 200,
    description: 'Discount code created successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('create/:eventId')
  async createDiscount(
    @Body() dto: CreateDiscountDto,
    @Param('eventId') eventId: string,
    @GetCurrentUser('id') user: string,
  ): Promise<IResponse> {
    try {
      const data = await this.discountService.createDiscount({
        ...dto,
        event: eventId,
        user,
      });
      return {
        statusCode: HttpStatus.CREATED,
        data: data,
        message: 'Discount created successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: ApplyDiscountDto })
  @ApiOperation({ summary: 'Apply discount code' })
  @ApiResponse({
    status: 200,
    description: 'Discount code applied successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('apply_discount_code')
  async applyDiscount(@Body() dto: ApplyDiscountDto) {
    try {
      const data = await this.discountService.applyDiscount(dto);
      return data;
    } catch (error) {
      return error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete discount' })
  @ApiResponse({
    status: 200,
    description: 'Discount code deleted successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('delete/:discountId')
  async deleteDiscount(@Param('discountId') discountId: string) {
    try {
      const data = await this.discountService.deleteDiscount(discountId);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Discount deleted sucessfully',
      };
    } catch (error) {
      return error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get discount by event id' })
  @ApiResponse({
    status: 200,
    description: 'Discount fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('event/:eventId')
  async getDiscountByEventId(@Param('eventId') eventId: string) {
    console.log(eventId, 'hh');
    try {
      const data = await this.discountService.getDiscountByEventId(eventId);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Discount fetched successfully',
      };
    } catch (error) {
      return error;
    }
  }
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get discount by ticket id' })
  @ApiResponse({
    status: 200,
    description: 'Discount fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('ticket/:ticketId')
  async getDiscountByTicketId(@Param('ticketId') ticketId: string) {
    try {
      const data = await this.discountService.getDiscountByTicketId(ticketId);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Discount fetched successfully',
      };
    } catch (error) {
      return error;
    }
  }
}
