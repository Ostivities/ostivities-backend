import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FeesDto {
  @ApiProperty({
    type: Number,
    description: 'fees',
    required: true,
  })
  @IsNotEmpty()
  fee: string;

  @ApiProperty({
    type: [Number, String],
    description: 'service charge',
    required: false,
  })
  @IsOptional()
  service_charge?: string | number;
}
