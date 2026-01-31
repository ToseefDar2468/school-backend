import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

const toBoolean = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return value;
};

export class ListNoticesQueryDto {
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  pinnedFirst?: boolean;
}
