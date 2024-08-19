import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { emailRegExp } from 'src/util/helper';
import { STAFF_ROLE } from 'src/util/types';

export class CoordinatorDto {
  @ApiProperty({
    description: 'Email address',
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
  @IsAlpha()
  staff_name: string;

  @ApiProperty({
    enum: STAFF_ROLE,
    description: 'staff role',
  })
  @IsEnum(STAFF_ROLE)
  @IsNotEmpty()
  staff_role: STAFF_ROLE;
}
