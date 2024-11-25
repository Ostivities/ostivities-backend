import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { emailRegExp } from 'src/util/helper';
import { ACCOUNT_TYPE, STAFF_ROLE } from 'src/util/types';

export class CoordinatorDto {
  @ApiProperty({
    description: 'Staff email address',
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Matches(emailRegExp, { message: 'email must be a valid email' })
  staff_email: string;

  @ApiProperty({
    description: 'staff name',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  staff_name: string;

  @ApiProperty({
    enum: STAFF_ROLE,
    description: 'staff role',
  })
  @IsEnum(STAFF_ROLE)
  @IsNotEmpty()
  staff_role: STAFF_ROLE;

  @ApiProperty({
    description: 'staff phone number',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  staff_phone_number: string;

  @ApiProperty({
    description: 'Business name',
    type: String,
    required: true,
  })
  @ValidateIf((o) => o.staff_role === STAFF_ROLE.AGENT)
  @IsNotEmpty({
    message: 'password is required for agent role',
  })
  @IsString()
  password: string;
}
