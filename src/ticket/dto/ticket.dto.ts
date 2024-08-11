import { PartialType } from '@nestjs/swagger';
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
  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  isCompulsory: boolean;
}

export class TicketDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsMongoId()
  event: string;

  @IsNotEmpty()
  @IsEnum(TICKET_ENTITY)
  @IsString()
  ticketEntity: TICKET_ENTITY;

  @IsNotEmpty()
  @IsEnum(TICKET_TYPE)
  @IsString()
  ticketType: TICKET_TYPE;

  @IsNotEmpty()
  @IsString()
  ticketName: string;

  @IsNotEmpty()
  @IsEnum(TICKET_STOCK)
  @IsString()
  ticketStock: TICKET_STOCK;

  @ValidateIf((o) => o.ticketStock === TICKET_STOCK.LIMITED)
  @IsNotEmpty()
  @IsNumber()
  ticketQty: number;

  @ValidateIf((o) => o.ticketType === TICKET_TYPE.PAID)
  @IsNotEmpty()
  @IsNumber()
  ticketPrice: number;

  @IsOptional()
  @IsString()
  ticketDescription?: string;

  @ValidateIf((o) => o.ticketType === TICKET_STOCK.LIMITED)
  @IsNotEmpty()
  @IsNumber()
  purchaseLimit?: number;

  @ValidateIf((o) => o.ticketEntity === TICKET_ENTITY.COLLECTIVE)
  @IsNotEmpty()
  @IsNumber()
  groupPrice: number;

  @ValidateIf((o) => o.ticketEntity === TICKET_ENTITY.COLLECTIVE)
  @IsNotEmpty()
  @IsNumber()
  groupSize: number;

  @IsNotEmpty()
  @IsBoolean()
  guestAsChargeBearer: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TicketQuestion)
  ticketQuestions: ITicketQuestions[];
}

export class CreateTicketDto extends TicketDto {}

export class UpdateTicketDto extends PartialType(TicketDto) {}
