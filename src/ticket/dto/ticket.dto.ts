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
import { ITicketQuestions, TICKET_STOCK, TICKET_TYPE } from 'src/util/types';

class TicketQuestion implements ITicketQuestions {
  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  isCompulsory: boolean;
}

export class SingleEvents {
  @IsNotEmpty()
  @IsEnum(TICKET_TYPE)
  @IsString()
  ticketType: string;

  @IsNotEmpty()
  @IsString()
  ticketName: string;

  @IsNotEmpty()
  @IsEnum(TICKET_STOCK)
  @IsString()
  ticketStock: string;

  @ValidateIf((o) => o.ticketStock === TICKET_STOCK.LIMITED)
  @IsNotEmpty()
  @IsNumber()
  ticketQty: number;

  @ValidateIf((o) => o.ticketType === TICKET_TYPE.PAID)
  @IsNotEmpty()
  @IsNumber()
  ticketPrice: number;

  @ValidateIf((o) => o.ticketType === TICKET_STOCK.LIMITED)
  @IsNotEmpty()
  @IsNumber()
  purchaseLimit?: number;

  @IsOptional()
  @IsString()
  ticketDescription?: string;

  @IsNotEmpty()
  @IsBoolean()
  guestAsChargeBearer: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TicketQuestion)
  ticketQuestions: ITicketQuestions[];
}

export class CollectiveEvents {
  @IsNotEmpty()
  @IsEnum(TICKET_TYPE)
  @IsString()
  ticketType: string;

  @IsNotEmpty()
  @IsString()
  ticketName: string;

  @IsNotEmpty()
  @IsEnum(TICKET_STOCK)
  @IsString()
  ticketStock: string;

  @IsNotEmpty()
  @IsNumber()
  groupPrice: number;

  @IsNotEmpty()
  @IsNumber()
  groupSize: number;

  @ValidateIf((o) => o.ticketType === TICKET_TYPE.PAID)
  @IsNotEmpty()
  @IsNumber()
  ticketPrice: number;

  @IsOptional()
  @IsString()
  ticketDescription: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TicketQuestion)
  ticketQuestions: ITicketQuestions[];

  @IsNotEmpty()
  @IsBoolean()
  guestAsChargeBearer: boolean;
}

export class TicketDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  eventId: string;

  @IsOptional()
  singleTicket: SingleEvents;

  @IsOptional()
  collectiveTicket: CollectiveEvents;
}

export class CreateTicketDto extends TicketDto {}

export class CreateSingleTicketDto extends SingleEvents {}

export class CreateCollectiveTicketDto extends CollectiveEvents {}

export class UpdateTicketDto extends PartialType(TicketDto) {}

export class UpdateSingleTicketDto extends PartialType(SingleEvents) {}

export class UpdateCollectiveTicketDto extends PartialType(CollectiveEvents) {}
