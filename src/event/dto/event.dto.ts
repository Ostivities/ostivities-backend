import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  EVENT_TYPES,
  ICollectiveEvents,
  ISingleEvents,
  ISocials,
  ISupportDocuments,
} from 'src/util/types';

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
  socials: ISocials[];

  @IsOptional()
  @IsString()
  @IsUrl()
  eventImage: string;

  @IsOptional()
  @IsObject()
  evenTicket: {
    singleTicket?: ISingleEvents;
    collectiveTicket?: ICollectiveEvents;
  };
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
