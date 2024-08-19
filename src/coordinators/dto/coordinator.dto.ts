import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { emailRegExp } from 'src/util/helper';

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
}
