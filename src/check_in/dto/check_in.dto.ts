import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckInDto {
  @ApiProperty({
    description: 'Check in date',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  check_in_date: string;

  @ApiProperty({
    description: 'Checked in by',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  check_in_by: string;
}
