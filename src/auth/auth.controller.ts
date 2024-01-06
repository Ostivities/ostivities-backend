import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { IResponse } from 'src/util/types';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async signUp(@Body() dto: CreateUserDto): Promise<IResponse> {
    const data = await this.authService.register(dto);
    return { statusCode: HttpStatus.CREATED, data, message: 'Success' };
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<IResponse> {
    const data = await this.authService.login(dto);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: 'successfully logged in',
    };
  }

  @Post('resetToken')
  async resetToken(@Body() dto: ForgotPasswordDto): Promise<IResponse> {
    const data = await this.authService.resetToken(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data,
    };
  }

  @Post('resetPassword')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<IResponse> {
    const data = await this.authService.resetPassword(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data,
    };
  }
}
