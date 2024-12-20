import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { emailRegExp } from 'src/util/helper';
import { GUEST_CATEGORY, PAYMENT_METHODS, TICKET_STOCK } from 'src/util/types';
import { AttendeeDto } from './attendees.dto';

class PersonalInformation {
  @ApiProperty({
    description: 'First name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  lastName: string;

  @ApiProperty({
    description: 'Email address',
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Matches(emailRegExp, { message: 'email must be a valid email' })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

class AttendeesInformation {
  @ApiProperty({
    description: 'First name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  lastName: string;

  @ApiProperty({
    description: 'Email address',
    type: String,
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @Matches(emailRegExp, { message: 'email must be a valid email' })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    type: String,
    description: 'ticket name',
    required: true,
  })
  @IsOptional()
  @IsString()
  ticket_name: string;

  @ApiProperty({
    type: String,
    description: 'ticket name',
    required: true,
  })
  @IsOptional()
  @IsString()
  ticket_price: string;
}

class AdditionalInformation {
  @ApiProperty({
    type: String,
    description: 'question',
    required: true,
  })
  @IsOptional()
  question?: string;

  @ApiProperty({
    type: String,
    description: 'question',
    required: false,
  })
  @IsOptional()
  answer?: string;
}

class TicketInformation {
  @ApiProperty({
    type: String,
    description: 'event Id',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  ticket_id: string;

  @ApiProperty({
    type: String,
    description: 'ticket name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ticket_name: string;

  @ApiProperty({
    description: 'ticket qty',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty({
    description: 'amount',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  total_amount: number;

  @ApiProperty({
    description: 'ticket price',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  ticket_price: number;

  @ApiProperty({
    type: String,
    description: 'ticket type',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ticket_type: string;

  @ApiProperty({
    type: String,
    description: 'ticket stock',
    required: true,
  })
  @IsEnum(TICKET_STOCK)
  @IsNotEmpty()
  ticket_stock: TICKET_STOCK;

  @ApiProperty({
    type: String,
    description: 'ticket order number',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  order_number: string;
}

export class GuestDto {
  @ApiProperty({
    type: String,
    description: 'event Id',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  event: string;

  @ApiProperty({
    type: String,
    description: 'event unique code',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  event_unique_code: string;

  @ApiProperty({
    type: [TicketInformation],
    description: 'ticket information',
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => TicketInformation)
  ticket_information: TicketInformation[];

  @ApiProperty({
    description: 'Personal Information',
    type: PersonalInformation,
    required: true,
  })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => PersonalInformation)
  personal_information: PersonalInformation;

  @ApiProperty({
    description: 'Attendees Information',
    type: [AttendeeDto],
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => AttendeeDto)
  @IsOptional()
  attendees_information?: AttendeeDto[];

  @ApiProperty({
    description: 'Additional Information',
    type: [AdditionalInformation],
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => AdditionalInformation)
  @IsOptional()
  additional_information?: AdditionalInformation[];

  @ApiProperty({
    enum: GUEST_CATEGORY,
    description: 'guest category',
  })
  @IsEnum(GUEST_CATEGORY)
  @IsNotEmpty()
  guest_category: GUEST_CATEGORY;

  @ApiProperty({
    description: 'service fee',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((o) => o.guest_category === GUEST_CATEGORY.BUYER)
  fees: number;

  @ApiProperty({
    description: 'discount',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((o) => o.guest_category === GUEST_CATEGORY.BUYER)
  discount: number;

  @ApiProperty({
    description: 'Total amount paid',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  total_amount_paid: number;

  @ApiProperty({
    description: 'Discount code',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  discountCode?: string;

  @ApiProperty({
    description: 'total purchased',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  total_purchased: number;

  @ApiProperty({
    enum: PAYMENT_METHODS,
    description: 'payment method',
  })
  @IsEnum(PAYMENT_METHODS)
  @IsNotEmpty()
  @ValidateIf((o) => o.guest_category === GUEST_CATEGORY.BUYER)
  payment_method: PAYMENT_METHODS;
}
