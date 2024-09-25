import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  ITicketQuestions,
  TICKET_ENTITY,
  TICKET_STOCK,
  TICKET_TYPE,
} from 'src/util/types';

class TicketQuestion implements ITicketQuestions {
  @ApiProperty({
    type: String,
    description: 'question',
    required: true,
  })
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    type: Boolean,
    description: 'is compulsory',
    required: true,
  })
  @IsNotEmpty()
  isCompulsory: boolean;
}

export class TicketDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @ApiProperty({
    type: String,
    description: 'event Id',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  event: string;

  @ApiProperty({
    enum: TICKET_ENTITY,
    description: 'ticket entity',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(TICKET_ENTITY)
  @IsString()
  ticketEntity: TICKET_ENTITY;

  @ApiProperty({
    enum: TICKET_TYPE,
    description: 'ticket type',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(TICKET_TYPE)
  @IsString()
  ticketType: TICKET_TYPE;

  @ApiProperty({
    type: String,
    description: 'ticket name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ticketName: string;

  @ApiProperty({
    enum: TICKET_STOCK,
    description: 'ticket stock',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(TICKET_STOCK)
  @IsString()
  ticketStock: TICKET_STOCK;

  @ApiProperty({
    type: Number,
    description: 'ticket qty',
    required: true,
  })
  @ValidateIf((o) => o.ticketStock === TICKET_STOCK.LIMITED)
  @IsNotEmpty()
  @IsNumber()
  ticketQty: number;

  @ApiProperty({
    type: Number,
    description: 'ticket price',
    required: true,
  })
  @ValidateIf((o) => o.ticketType === TICKET_TYPE.PAID)
  @IsNotEmpty()
  @IsNumber()
  ticketPrice: number;

  @ApiProperty({
    type: String,
    description: 'ticket description',
    required: false,
  })
  @IsOptional()
  @IsString()
  ticketDescription?: string;

  @ApiProperty({
    type: Number,
    description: 'purchase limit',
    required: true,
  })
  @ValidateIf((o) => o.ticketType === TICKET_STOCK.LIMITED)
  @IsNotEmpty()
  @IsNumber()
  purchaseLimit?: number;

  @ApiProperty({
    type: Number,
    description: 'group price',
    required: true,
  })
  @ValidateIf(
    (o) =>
      o.ticketType === TICKET_TYPE.PAID &&
      o.ticketEntity === TICKET_ENTITY.COLLECTIVE,
  )
  @IsNotEmpty()
  @IsNumber()
  groupPrice: number;

  @ApiProperty({
    type: Number,
    description: 'group size',
    required: true,
  })
  @ValidateIf((o) => o.ticketEntity === TICKET_ENTITY.COLLECTIVE)
  @IsNotEmpty()
  @IsNumber()
  groupSize: number;

  @ApiProperty({
    type: Boolean,
    description: 'charge bearer',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  guestAsChargeBearer: boolean;

  @ApiProperty({
    type: [TicketQuestion],
    description: 'ticket questions',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TicketQuestion)
  ticketQuestions: ITicketQuestions[];
}

export class CreateTicketDto extends TicketDto {}

export class UpdateTicketDto extends PartialType(TicketDto) {}
