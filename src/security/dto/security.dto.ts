import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SecurityDto {
  @ApiProperty({
    description: 'user id',
    type: String,
  })
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @ApiProperty({
    description: 'public key',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  publicKey: string;

  @ApiProperty({
    description: 'secret key',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  secretKey: string;
}
