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
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EVENT_INFO, EVENT_TYPES } from 'src/util/types';

class ValidateSocials {
  @ApiProperty({
    type: String,
    description: 'Event name',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Event Custom URL',
    required: false,
  })
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
  @IsNotEmpty()
  eventType: string;

  @IsEnum(EVENT_INFO)
  @IsNotEmpty()
  eventInfo: string;

  @IsNotEmpty()
  @IsString()
  timeZone: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.ventInfo === EVENT_INFO.RECURRING)
  frequency: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.ventInfo === EVENT_INFO.SINGLE)
  startDate: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.ventInfo === EVENT_INFO.SINGLE)
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

  // @IsOptional()
  // singleTicket: SingleEvents;

  // @IsOptional()
  // collectiveTicket: CollectiveEvents;

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
