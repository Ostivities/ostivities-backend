import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/util/types';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import {
  ActivateAccountDto,
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
  VerifyAccountDto,
} from './dto/auth.dto';

@Controller('auth')
@ApiTags('Authentication Service')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('register')
  async signUp(@Body() dto: CreateUserDto): Promise<IResponse> {
    const data = await this.authService.register(dto);
    return { statusCode: HttpStatus.CREATED, data, message: 'Success' };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ActivateAccountDto })
  @ApiOperation({ summary: 'Generate otp' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('generate_otp')
  async generateOtp(@Body() dto: ActivateAccountDto) {
    await this.authService.generateOtp(dto);
    return {
      statusCode: HttpStatus.OK,
      message: `OTP sent to ${dto.email}`,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: VerifyAccountDto })
  @ApiOperation({ summary: 'Verify otp' })
  @ApiResponse({
    status: 200,
    description: 'OTP Verification.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('verify_otp')
  async activateAccount(@Body() dto: VerifyAccountDto) {
    try {
      const data = await this.authService.activateAccount(dto);

      return {
        statusCode: HttpStatus.OK,
        message: `${dto.email} verified successfully`,
        data,
      };
    } catch (error) {
      return error;
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<IResponse> {
    const data = await this.authService.login(dto);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: 'Login successful',
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOperation({ summary: 'Reset Token' })
  @ApiResponse({
    status: 200,
    description: 'Token sent successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('reset_token')
  async resetToken(@Body() dto: ForgotPasswordDto): Promise<IResponse> {
    const data = await this.authService.resetToken(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ResetPasswordDto })
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('reset_password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<IResponse> {
    const data = await this.authService.resetPassword(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data,
    };
  }

  @Get('users')
  async allUsers(): Promise<IResponse> {
    const data = await this.authService.getAllUsers();
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data,
    };
  }
}
