import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IResponse } from 'src/util/types';
import {
  SettlementDto,
  UpdateSettlementDto,
  ValidateAccountDto,
} from './dto/settlement.dto';
import { SettleAccountsService } from './settle_accounts.service';

@UseGuards(JwtAuthGuard)
@Controller('settlement_account')
@ApiTags('Settlement Account Service')
export class SettleAccountsController {
  constructor(private settleAccountService: SettleAccountsService) {}

  @ApiBody({ type: SettlementDto })
  @ApiOperation({ summary: 'Create settlement account' })
  @ApiResponse({
    status: 200,
    description: 'Settlement account created successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('create')
  async createSettleAccount(
    @Body() dto: SettlementDto,
    @GetCurrentUser('id') id: string,
  ): Promise<IResponse> {
    try {
      const data = await this.settleAccountService.createSettleAccount({
        ...dto,
        user: id,
      });
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'settlement account created successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @ApiBody({ type: SettlementDto })
  @ApiOperation({ summary: 'Update settlement account' })
  @ApiResponse({
    status: 200,
    description: 'Settlement account updated successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('update')
  async updateSettleAccount(
    @Body() dto: UpdateSettlementDto,
    @GetCurrentUser('id') user: string | any,
  ): Promise<IResponse> {
    try {
      const data = await this.settleAccountService.updateSettleAccount(
        user?._id,
        {
          ...dto,
          user: user?._id,
        },
      );
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'settlement account updated successfully',
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get settlement account' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Settlement account fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('get/:id')
  async getASettlementAccount(@Param('id') id: string): Promise<IResponse> {
    try {
      const data = await this.settleAccountService.getSettleAccount(id);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Settle account fetched successfully',
      };
    } catch (e) {
      throw new ForbiddenException(e?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of banks' })
  @ApiResponse({
    status: 200,
    description: 'Banks fetched successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('banks')
  async getBanks(): Promise<IResponse> {
    try {
      const data = await this.settleAccountService.getBanks();
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Banks fetched successfully',
      };
    } catch (e) {
      throw new ForbiddenException(e?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify account number' })
  @ApiResponse({
    status: 200,
    description: 'Account number verified successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('validate_account_number')
  async validateAccountNumber(@Body() dto: ValidateAccountDto) {
    try {
      const data = await this.settleAccountService.validateAccountNumber(dto);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Account number verified successfully.',
      };
    } catch (e) {
      throw new ForbiddenException(e?.message);
    }
  }
}
