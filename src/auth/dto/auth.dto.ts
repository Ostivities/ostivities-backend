import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { emailRegExp } from 'src/util/helper';
import { ACCOUNT_TYPE } from '../../util/types';

export class CreateUserDto {
  @ApiProperty({
    enum: ACCOUNT_TYPE,
    description: 'Account type',
  })
  @IsEnum(ACCOUNT_TYPE)
  @IsNotEmpty()
  accountType: ACCOUNT_TYPE;

  @ApiProperty({
    description: 'First name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  @ValidateIf((o) => o.accountType === ACCOUNT_TYPE.PERSONAL)
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  @ValidateIf((o) => o.accountType === ACCOUNT_TYPE.PERSONAL)
  lastName: string;

  @ApiProperty({
    description: 'Business name',
    type: String,
    required: true,
  })
  @ValidateIf((o) => o.accountType === ACCOUNT_TYPE.ORGANISATION)
  @IsNotEmpty({
    message: 'Business name is required for organisation accounts',
  })
  @IsString()
  businessName: string;

  @ApiProperty({
    description: 'Email address',
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Matches(emailRegExp, { message: 'email must be a valid email' })
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
    description: 'Terms and conditions',
    type: Boolean,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  terms_and_condition: boolean;
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

export class ActivateAccountDto {
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

  // @ApiProperty({
  //   description: 'OTP',
  //   type: Number,
  //   required: true,
  // })
  // @IsNumber()
  // @IsNotEmpty()
  // otp: number;
}

export class VerifyAccountDto {
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
    description: 'OTP',
    type: Number,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['terms_and_condition'] as const),
) {
  @ApiProperty({
    description: 'image or logo',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Old password',
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
  old_password: string;

  @ApiProperty({
    description: 'New password',
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
    description: 'Confirm password',
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
  confirm_password: string;
}
