import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';
import { BulkEmailService } from './bulk_email.service';
import { BulkEmailDto } from './dto/email.dto';

@Controller('bulk_email')
@ApiTags('Email Service')
export class BulkEmailController {
  constructor(private bulkEmailService: BulkEmailService) {}

  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: BulkEmailDto })
  @ApiOperation({ summary: 'Send email' })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async SendBulkEmail(
    @Body() dto: BulkEmailDto,
    @GetCurrentUser('id') userId: string,
  ) {
    try {
      await this.bulkEmailService.sendBulkEmail(dto, userId);
      return { statusCode: HttpStatus.OK, message: 'Email sent' };
    } catch (error) {
      console.log(error, 'error-here');
      return error;
    }
  }
}
