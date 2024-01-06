import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { IResponse } from 'src/util/types';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async signUp(@Body() dto: CreateUserDto): Promise<IResponse> {
    const data = await this.authService.register(dto);
    return { statusCode: HttpStatus.CREATED, data, message: 'Success' };
  }

  // @Post('login')
  // login(@Body() dto: LoginUserDto) {
  //   return this.authService.login(dto);
  // }
}
