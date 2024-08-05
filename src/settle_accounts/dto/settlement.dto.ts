import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SettlementDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsString()
  account_name: string;

  @IsNotEmpty()
  @IsString()
  account_number: string;

  @IsNotEmpty()
  @IsString()
  bank_code: string;

  @IsNotEmpty()
  @IsString()
  bank_name: string;
}

export class UpdateSettlementDto extends SettlementDto {}
