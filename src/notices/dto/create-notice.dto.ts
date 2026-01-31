import {
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description!: string;

  @IsISO8601()
  dateISO!: string;

  @IsBoolean()
  isPinned!: boolean;

  @IsOptional()
  @IsUrl()
  attachmentUrl?: string;
}
