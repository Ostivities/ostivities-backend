import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SecurityDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsString()
  publicKey: string;

  @IsNotEmpty()
  @IsString()
  secretKey: string;
}
