import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { IResponse } from 'src/util/types';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { GetCurrentUser } from './decorator/user.decorator';
import {
  ActivateAccountDto,
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
  UpdatePasswordDto,
  UpdateUserDto,
  VerifyAccountDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
@ApiTags('Authentication Service')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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
    try {
      const data = await this.authService.register(dto);
      return { statusCode: HttpStatus.CREATED, data, message: 'Success' };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
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
    try {
      await this.authService.generateOtp(dto);
      return {
        statusCode: HttpStatus.OK,
        message: `OTP sent to ${dto.email}`,
      };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
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
  async activateAccount(@Body() dto: VerifyAccountDto): Promise<IResponse> {
    try {
      const data = await this.authService.activateAccount(dto);
      console.log(data, 'jj');
      return {
        statusCode: HttpStatus.OK,
        message: `${dto.email} verified successfully`,
        data,
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
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
    try {
      const data = await this.authService.login(dto);
      return {
        statusCode: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
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
    try {
      const data = await this.authService.resetToken({ ...dto });
      return {
        statusCode: HttpStatus.OK,
        message: 'successful',
        data,
      };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
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
    try {
      const data = await this.authService.resetPassword(dto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Password changed successfully',
        data,
      };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
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
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile fetched sccessfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('profile')
  async getUserProfile(
    @GetCurrentUser('id') user: string | any,
  ): Promise<IResponse> {
    try {
      const data = await this.authService.getUserProfile(user);
      return {
        statusCode: HttpStatus.OK,
        message: 'User profile fetched sccessfully',
        data,
      };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'user id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  @Put('user/:id')
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateUserProfile(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const data = await this.authService.updateUserProfile(dto, id);
      return {
        statusCode: HttpStatus.OK,
        message: 'User profile updated successfully',
        data,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'user id' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOperation({ summary: 'change password' })
  @ApiResponse({
    status: 200,
    description: 'User password updated sccessfully',
  })
  @Patch('password/:id')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    try {
      const data = await this.authService.updateUserPassword(dto, id);
      return {
        statusCode: HttpStatus.OK,
        message: 'User password updated successfully',
        data,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'logout/invalidate token' })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
  })
  @Post('logout')
  async logout(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(token) as any;
    const expiresAt = new Date(decodedToken.exp * 1000);
    await this.authService.logout(token, expiresAt);
    return { message: 'Logged out successfully' };
  }
}
