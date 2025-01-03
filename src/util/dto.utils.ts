import { IsString } from 'class-validator';

export class PaginationDto {
  @IsString()
  page: string;

  @IsString()
  limit: string;
}

export class PdfDto {}
