import {
  Body,
  Controller,
  Delete,
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
import { CreateDiscountDto } from './dto/discount.dto';

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
    description: 'Discount created successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('create/:eventId')
  async createDiscount(
    @Body() dto: CreateDiscountDto,
    @Param('id') eventId: string,
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
        message: 'Discount created sucessfully',
      };
    } catch (error) {
      return error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete discount' })
  @ApiResponse({
    status: 200,
    description: 'Discount deleted successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('delete/:discountId')
  async deleteDiscount(@Param('discountId') discountId: string) {
    try {
      const data = await this.discountService.deleteDiscount(discountId);
      return {
        statusCode: HttpStatus.CREATED,
        data: data,
        message: 'Discount created sucessfully',
      };
    } catch (error) {}
  }
}
