import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
import { emailRegExp } from 'src/util/helper';

class Receipient {
  @ApiProperty({
    description: 'Receipient name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
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
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'pdf content',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'absolute',
    type: String,
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  url?: string;
}

export class BulkEmailDto {
  @ApiProperty({
    description: 'Sender name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  sender_name: string;

  @ApiProperty({
    description: 'Sender email',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @Matches(emailRegExp, { message: 'email must be a valid email' })
  sender_email: string;

  @ApiProperty({
    description: 'Reply email',
    type: String,
    required: false,
  })
  @IsEmail()
  @Matches(emailRegExp, { message: 'email must be a valid email' })
  @IsOptional()
  reply_to: string;

  @ApiProperty({
    type: [Receipient],
    description: 'receipient(s)',
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Receipient)
  receipients: Receipient[];

  @ApiProperty({
    description: 'Subject of email',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  email_subject: string;

  @ApiProperty({
    description: 'Message or content of email',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email_content: string;

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
