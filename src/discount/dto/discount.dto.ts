import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';
import { DISCOUNT_TYPES, DISCOUNT_USAGE_LIMIT } from 'src/util/types';

export class DiscountDto {
  @ApiProperty({
    type: String,
    description: 'discount code',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  discountCode: string;

  @ApiProperty({
    type: Number,
    description: 'discount number',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  discount_value: number;

  @ApiProperty({
    enum: DISCOUNT_TYPES,
    description: 'Discount types',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(DISCOUNT_TYPES)
  @IsString()
  discountType: DISCOUNT_TYPES;

  @ApiProperty({
    type: [String],
    description: 'ticket(s)',
    required: true,
  })
  @IsNotEmpty()
  @ValidateIf((obj) => Array.isArray(obj.ticket))
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  ticket: [Types.ObjectId];

  @ApiProperty({
    enum: DISCOUNT_USAGE_LIMIT,
    description: 'Discount usage limit',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(DISCOUNT_USAGE_LIMIT)
  @IsString()
  usageLimit: DISCOUNT_USAGE_LIMIT;

  @ApiProperty({
    type: String,
    description: 'start date and time',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  startDateAndTime: string;

  @ApiProperty({
    type: String,
    description: 'end date and time',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  endDateAndTime: string;

  @ApiProperty({
    type: String,
    description: 'event Id',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  event: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}

export class CreateDiscountDto extends DiscountDto {}

export class ApplyDiscountDto {
  @ApiProperty({
    type: [String],
    description: 'ticket(s)',
    required: true,
  })
  @IsNotEmpty()
  @ValidateIf((obj) => Array.isArray(obj.ticket))
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  ticket: [Types.ObjectId];

  @ApiProperty({
    type: String,
    description: 'event id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  event: string;

  @ApiProperty({
    type: String,
    description: 'discount code',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  discount_code: string;

  @ApiProperty({
    type: String,
    description: 'guest id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  guest: string;
}

export class UpdateDiscountDto extends PartialType(
  OmitType(DiscountDto, ['discountCode'] as const),
) {}
