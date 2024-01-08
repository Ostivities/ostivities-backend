import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ACCOUNT_TYPE } from '../../util/types';

export class CreateUserDto {
  @ApiProperty({
    enum: ACCOUNT_TYPE,
    description: 'Account type',
  })
  @IsEnum(ACCOUNT_TYPE)
  @IsNotEmpty()
  accountType: string;

  @ApiProperty({
    description: 'First name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  lastName: string;

  @ApiProperty({
    description: 'Email address',
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Matches(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    { message: 'email must be a valid email' },
  )
  email: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    required: true,
    maxLength: 20,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'password must contain Min of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;
}

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address',
    type: String,
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Matches(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    { message: 'email must be a valid email' },
  )
  email: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    required: true,
    maxLength: 20,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'password must contain Min of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'email address',
    type: String,
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Matches(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    { message: 'email must be a valid email' },
  )
  email: string;

  @ApiProperty({
    description: 'Origin URL',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  originUrl: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email address',
    type: String,
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Matches(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    { message: 'email must be a valid email' },
  )
  email: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    required: true,
    maxLength: 20,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'password must contain Min of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Token from email address',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
