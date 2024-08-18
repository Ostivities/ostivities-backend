import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { emailRegExp } from 'src/util/helper';
import { PAYMENT_METHODS } from 'src/util/types';

class PersonalInformation {
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
  @Matches(emailRegExp, { message: 'email must be a valid email' })
  email: string;

  @ApiProperty({
    description: 'Terms and conditions',
    type: Boolean,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  terms_and_condition: boolean;

  @ApiProperty({
    description: 'Phone number',
    type: Boolean,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class GuestDto {
  @ApiProperty({
    type: String,
    description: 'event Id',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  event: string;

  @ApiProperty({
    type: String,
    description: 'ticket Id',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  ticket: string;

  @ApiProperty({
    description: 'Personal Information',
    type: PersonalInformation,
    required: true,
  })
  @ValidateNested()
  @IsNotEmpty()
  peronal_information: PersonalInformation;

  @ApiProperty({
    description: 'service fee',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  fees: number;

  @ApiProperty({
    description: 'Total amount paid',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  total_amount_paid: number;

  @ApiProperty({
    description: 'Discount code',
    type: String,
    required: false,
  })
  @IsString()
  @IsEmpty()
  disocuntCode: number;

  @ApiProperty({
    description: 'Quantity',
    type: Number,
    required: true,
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number = 1;

  @IsNumber()
  @IsNotEmpty()
  orderNo: number;

  @ApiProperty({
    enum: PAYMENT_METHODS,
    description: 'payment method',
  })
  @IsEnum(PAYMENT_METHODS)
  @IsNotEmpty()
  payment_method: PAYMENT_METHODS;
}
