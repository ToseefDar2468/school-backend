import {
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class UpdateNoticeDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsISO8601()
  dateISO?: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsUrl()
  attachmentUrl?: string;
}
