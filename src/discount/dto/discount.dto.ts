import { PartialType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';
import { DISCOUNT_TYPES, DISCOUNT_USAGE_LIMIT } from 'src/util/types';

export class DiscountDto {
  @IsNotEmpty()
  @IsString()
  discountCode: string;

  @IsNotEmpty()
  @IsEnum(DISCOUNT_TYPES)
  @IsString()
  discountType: DISCOUNT_TYPES;

  @IsNotEmpty()
  @ValidateIf((obj) => Array.isArray(obj.ticket))
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  ticket: Types.ObjectId[] | Types.ObjectId;

  @IsNotEmpty()
  @IsEnum(DISCOUNT_USAGE_LIMIT)
  @IsString()
  usageLimit: DISCOUNT_USAGE_LIMIT;

  @IsNotEmpty()
  @IsString()
  startDateAndTime: string;

  @IsNotEmpty()
  @IsString()
  endDateAndTime: string;

  @IsNotEmpty()
  @IsMongoId()
  event: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}

export class CreateDiscountDto extends DiscountDto {}

export class UpdateDiscountDto extends PartialType(DiscountDto) {}
