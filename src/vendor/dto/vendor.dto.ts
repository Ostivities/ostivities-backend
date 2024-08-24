import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ValidateSocials } from 'src/event/dto/event.dto';
import { emailRegExp } from 'src/util/helper';

export class VendorDto {
  @ApiProperty({
    type: [ValidateSocials],
    description: 'social media',
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
    description: 'vendor phone number',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  vendor_phone_number: string;

  @ApiProperty({
    description: 'vendor address',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  vendor_address: string;

  @ApiProperty({
    description: 'vendor image or buisness logo',
    type: String,
    required: false,
  })
  @IsUrl()
  @IsOptional()
  vendor_logo: string;

  @ApiProperty({
    description: 'vendor specialities',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  specialities: string;

  @ApiProperty({
    description: 'vendor business description',
    type: String,
    required: false,
  })
  @IsEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'vendor requires exhibition space',
    type: Boolean,
    required: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  exhibition_space: false;
}
