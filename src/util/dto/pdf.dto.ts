import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PdfContent {
  @IsNotEmpty()
  @IsString()
  order_number: string;

  @IsNotEmpty()
  @IsString()
  order_date: string;

  @IsNotEmpty()
  @IsString()
  event_date_time: string;

  @IsNotEmpty()
  @IsString()
  event_address: string;

  @IsNotEmpty()
  @IsString()
  buyer_name: string;

  @IsNotEmpty()
  @IsString()
  ticket_name: string;

  @IsNotEmpty()
  @IsString()
  ticket_type: string;

  @IsNotEmpty()
  @IsString()
  event_name: string;

  @IsNotEmpty()
  @IsString()
  qr_code: string;

  @IsNotEmpty()
  @IsString()
  ostivities_logo: string;

  @IsNotEmpty()
  @IsString()
  ticket_banner: string;
}

export class PdfDto {
  @IsNotEmpty()
  @IsString()
  event_name: string;

  @IsNotEmpty()
  @IsString()
  order_number: string;

  @IsNotEmpty()
  @IsString()
  order_date: string;

  @IsNotEmpty()
  @IsString()
  event_date_time: string;

  @IsNotEmpty()
  @IsString()
  event_address: string;

  @IsNotEmpty()
  @IsString()
  buyer_name: string;

  @IsNotEmpty()
  @IsMongoId()
  buyer_id: string;

  @IsNotEmpty()
  @IsMongoId()
  event_id: string;

  @IsNotEmpty()
  @IsNumber()
  total_pages: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdfContent)
  content: PdfContent[];
}
