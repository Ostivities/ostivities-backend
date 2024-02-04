import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

class SingleEvents {
  @IsOptional()
  @IsString()
  ticketType?: string;

  @IsOptional()
  @IsString()
  ticketName?: string;

  @IsOptional()
  @IsString()
  ticketStock?: string;

  @IsOptional()
  @IsString()
  ticketPrice?: string;

  @IsOptional()
  @IsNumber()
  purchaseLimit?: number;

  @IsOptional()
  @IsString()
  ticketDescription?: string;
}

class CollectiveEvents {
  @IsOptional()
  @IsString()
  ticketType: string;

  @IsOptional()
  @IsString()
  ticketName: string;

  @IsOptional()
  @IsString()
  ticketStock: string;

  @IsOptional()
  @IsString()
  groupPrice: string;

  @IsOptional()
  @IsString()
  groupSize: string;

  @IsOptional()
  @IsString()
  ticketPrice: string;

  @IsOptional()
  @IsString()
  ticketDescription: string;
}

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  eventName: string;

  @IsOptional()
  singleTicket: SingleEvents;

  @IsOptional()
  collectiveTicket: CollectiveEvents;
}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}
