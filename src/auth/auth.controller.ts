import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/util/types';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@Controller('auth')
@ApiTags('Authentication Service')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async signUp(@Body() dto: CreateUserDto): Promise<IResponse> {
    const data = await this.authService.register(dto);
    return { statusCode: HttpStatus.CREATED, data, message: 'Success' };
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<IResponse> {
    const data = await this.authService.login(dto);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: 'successfully logged in',
    };
  }

  @Public()
  @Post('resetToken')
  async resetToken(@Body() dto: ForgotPasswordDto): Promise<IResponse> {
    const data = await this.authService.resetToken(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data,
    };
  }

  @Public()
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
