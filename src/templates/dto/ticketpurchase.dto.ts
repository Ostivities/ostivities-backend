import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class TicketInformation {
  @IsNotEmpty()
  @IsMongoId()
  ticket_id: string;

  @IsNotEmpty()
  @IsString()
  ticket_name: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  total_amount: number;

  @IsNotEmpty()
  @IsNumber()
  ticket_price: number;
}

export class CreateOrderEmailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  order_number: string;

  @IsString()
  @IsNotEmpty()
  event_name: string;

  @IsString()
  @IsNotEmpty()
  event_date_time: string;

  @IsString()
  @IsNotEmpty()
  order_date: string;

  @IsString()
  @IsNotEmpty()
  event_address: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ticket_name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  order_qty?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  order_price?: string;

  @IsString()
  @IsNotEmpty()
  order_fees: string;

  @IsString()
  @IsNotEmpty()
  order_discount: string;

  @IsString()
  @IsNotEmpty()
  order_subtotal: string;

  @IsString()
  @IsNotEmpty()
  host_email: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketInformation)
  tickets?: TicketInformation[];
}
