import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { CollectiveEvents, SingleEvents } from 'src/ticket/dto/ticket.dto';
import { EVENT_TYPES } from 'src/util/types';

class ValidateSocials {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  url: string;
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

export class UpdateEventDto extends PartialType(CreateEventDto) {
  user?: string;
}

export class StringArrayDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  ids: string[];
}
