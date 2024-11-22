import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SettlementDto {
  @ApiProperty({
    description: 'user id',
    type: String,
  })
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @ApiProperty({
    description: 'account name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  account_name: string;

  @ApiProperty({
    description: 'account number',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  account_number: string;

  @ApiProperty({
    description: 'bank code',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  bank_code: string;

  @ApiProperty({
    description: 'bank name',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  bank_name: string;
}

export class UpdateSettlementDto extends PartialType(SettlementDto) {}

export class ValidateAccountDto {
  @ApiProperty({
    description: 'account number',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  account_number: string;

  @ApiProperty({
    description: 'bank code',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  bank_code: string;
}
