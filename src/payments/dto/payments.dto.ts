import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { emailRegExp } from '../../util/helper';

export class InitiatePaymentDto {
  @ApiProperty({
    description: 'Amount',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  amount: string;

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
    description: 'Event unique key',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  event_unique_key: string;

  // @ApiProperty({
  //   description: 'user id',
  //   type: String,
  //   required: true,
  // })
  // @IsString()
  // @IsNotEmpty()
  // user_id: string;
}

export class InitiateTransferDto {
  @ApiProperty({
    description: 'Amount',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: string;

  @ApiProperty({
    description: 'reason',
    type: String,
    required: true,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class FinaliseTransferDto {}
