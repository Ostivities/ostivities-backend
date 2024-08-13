import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IResponse } from 'src/util/types';
import { SecurityService } from './security.service';

@UseGuards(JwtAuthGuard)
@Controller('security')
@ApiTags('API Key Service')
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get API keys' })
  @ApiResponse({
    status: 200,
    description: 'API keys retrieved successfully.',
  })
  @Get('api_keys')
  async getApiKeys(@GetCurrentUser('id') userId: string): Promise<IResponse> {
    const data = await this.securityService.getApiKeys(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Api key fetched successfully',
      data,
    };
  }
}
