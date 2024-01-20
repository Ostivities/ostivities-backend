import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { EVENT_TYPES } from 'src/util/types';

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

class SupportDocuments {
  @IsOptional()
  @IsString()
  fileName: string;

  @IsOptional()
  @IsString()
  fileUrl: string;
}

export class EventDto {
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
  @ValidateNested()
  @Type(() => SupportDocuments)
  supportingDocument: SupportDocuments;

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
  singleTicket: SingleEvents;

  @IsOptional()
  collectiveTicket: CollectiveEvents;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}

export class CreateEventDto extends OmitType(EventDto, ['user']) {}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
