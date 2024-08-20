import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ValidateSocials } from 'src/event/dto/event.dto';
import { emailRegExp } from 'src/util/helper';

export class VendorDto {
  @ApiProperty({
    type: ValidateSocials,
    description: 'social media url',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidateSocials)
  socials: ValidateSocials[];

  @ApiProperty({
    description: 'vendor email address',
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Matches(emailRegExp, { message: 'email must be a valid email' })
  vendor_email: string;

  @ApiProperty({
    description: 'vendor name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  vendor_name: string;

  @ApiProperty({
    description: 'vendor specialities',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  specialities: string;
}
