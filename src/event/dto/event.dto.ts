import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { EVENT_TYPES, ISupportDocuments } from 'src/util/types';

class ValidateSocials {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  url: string;
}

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

class EventTicket {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SingleEvents)
  singleTicket?: SingleEvents;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CollectiveEvents)
  collectiveTicket?: CollectiveEvents;
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  eventName: string;

  @IsNotEmpty()
  @IsString()
  eventDetails: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  eventURL: string;

  @IsOptional()
  @IsObject()
  supportingDocument: ISupportDocuments;

  @IsEnum(EVENT_TYPES)
  @IsOptional()
  eventType: string;

  @IsOptional()
  @IsString()
  timeZone: string;

  @IsOptional()
  @IsString()
  frequency: string;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidateSocials)
  socials: ValidateSocials[];

  @IsOptional()
  @IsString()
  @IsUrl()
  eventImage: string;

  @IsOptional()
  evenTicket: EventTicket;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
