import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ACCOUNT_TYPE } from '../../util/types';

export class CreateUserDto {
  @IsEnum(ACCOUNT_TYPE)
  @IsNotEmpty()
  accountType: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
