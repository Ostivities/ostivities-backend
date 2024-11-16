import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  EVENT_INFO,
  EVENT_MODE,
  EVENT_TYPES,
  EXHIBITION_SPACE,
} from 'src/util/types';

export class ValidateSocials {
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
  @ApiProperty({
    type: String,
    description: 'file name',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileName: string;

  @ApiProperty({
    type: String,
    description: 'file URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  fileUrl: string;
}

export class EventDto {
  @ApiProperty({
    type: String,
    description: 'Event name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  eventName: string;

  @ApiProperty({
    type: String,
    description: 'Event details',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  eventDetails: string;

  @ApiProperty({
    type: String,
    description: 'state',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    type: String,
    description: 'Address',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    type: String,
    description: 'Event URL',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  eventURL: string;

  @ApiProperty({
    type: SupportDocuments,
    description: 'Supporting documents',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SupportDocuments)
  supportingDocument: SupportDocuments;

  @ApiProperty({
    enum: EVENT_TYPES,
    description: 'event type',
    required: true,
  })
  @IsEnum(EVENT_TYPES)
  @IsNotEmpty()
  eventType: EVENT_TYPES;

  @ApiProperty({
    enum: EVENT_INFO,
    description: 'event information',
    required: true,
  })
  @IsEnum(EVENT_INFO)
  @IsNotEmpty()
  eventInfo: EVENT_INFO;

  @ApiProperty({
    type: String,
    description: 'time zone',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  timeZone: string;

  @ApiProperty({
    type: String,
    description: 'frequency',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.ventInfo === EVENT_INFO.RECURRING)
  frequency: string;

  @ApiProperty({
    type: String,
    description: 'start date',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.ventInfo === EVENT_INFO.SINGLE)
  startDate: string;

  @ApiProperty({
    type: String,
    description: 'end date',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.ventInfo === EVENT_INFO.SINGLE)
  endDate: string;

  @ApiProperty({
    type: ValidateSocials,
    description: 'social media url',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidateSocials)
  socials: ValidateSocials[];

  @ApiProperty({
    type: String,
    description: 'image url',
    required: false,
  })
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

  @ApiProperty({
    description: 'vendor registration',
    required: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  vendor_registration: boolean;

  @ApiProperty({
    enum: EXHIBITION_SPACE,
    description: 'exhibition space available for booking',
    required: false,
  })
  @IsOptional()
  @IsEnum(EXHIBITION_SPACE)
  @ValidateIf((o) => o.vendor_registration === true)
  exhibition_space_booking: EXHIBITION_SPACE;

  @ApiProperty({
    description: 'space available for booking',
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((o) => o.exhibition_space_booking === EXHIBITION_SPACE.PAID)
  space_available: number;

  @ApiProperty({
    description: 'space fee',
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((o) => o.exhibition_space_booking === EXHIBITION_SPACE.PAID)
  space_fee: number;

  @ApiProperty({
    type: String,
    description: 'unique key',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  unique_key: string;

  @ApiProperty({
    type: String,
    description: 'map coordinates',
    required: false,
  })
  @IsOptional()
  @IsString()
  event_coordinates?: string;
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

export class UpdateEventDiscoveryDto extends PickType(StringArrayDto, ['ids']) {
  @ApiProperty({ type: Boolean, description: 'discover' })
  @IsBoolean()
  @IsNotEmpty()
  discover: boolean;
}

export class UpdateEventModeDto extends PickType(StringArrayDto, ['ids']) {
  @ApiProperty({
    enum: EVENT_MODE,
    description: 'event mode',
  })
  @IsEnum(EVENT_MODE)
  @IsNotEmpty()
  mode: EVENT_MODE;
}

export class UpdateEventRegistrationDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'event id',
  })
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    type: Boolean,
    description: 'enable / disable registration of an event',
  })
  @IsBoolean()
  @IsNotEmpty()
  enable_registration: boolean;
}
