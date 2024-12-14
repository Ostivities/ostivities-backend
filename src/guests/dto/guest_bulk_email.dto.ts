import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
} from 'class-validator';
import { emailRegExp } from '../../util/helper';
import { Type } from 'class-transformer';

class Recipient {
  @ApiProperty({
    description: 'Recipient name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email address',
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Matches(emailRegExp, { message: 'email must be a valid email' })
  email: string;
}

class Attachments {
  @ApiProperty({
    description: 'document name',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'pdf content',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'absolute',
    type: String,
    required: true,
  })
  @IsUrl()
  @IsOptional()
  url?: string;
}

export class BulkEmailGuestDto {
  @ApiProperty({
    type: String,
    description: 'sender name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  sender_name: string;

  @ApiProperty({
    type: String,
    description: 'sender email',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(emailRegExp, { message: 'Email must be a valid Email' })
  sender_email: string;

  @ApiProperty({
    type: String,
    description: 'reply to email',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(emailRegExp, { message: 'Email must be a valid Email' })
  reply_to: string;

  @ApiProperty({
    type: [Recipient],
    description: 'recipient(s)',
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Recipient)
  recipients: Recipient[];

  @ApiProperty({
    type: String,
    description: 'event Id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    type: String,
    description: 'event Id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    type: [Attachments],
    description: 'Attachments',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attachments)
  @IsOptional()
  email_attachment?: Attachments[];
}
