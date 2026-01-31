import { InquiryStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class InquiryQueryDto {
  @IsOptional()
  @IsEnum(InquiryStatus)
  status?: InquiryStatus;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}
