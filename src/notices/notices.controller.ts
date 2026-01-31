import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ListNoticesQueryDto } from './dto/list-notices-query.dto';
import { NoticesService } from './notices.service';

@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  list(@Query() query: ListNoticesQueryDto) {
    return this.noticesService.listPublic(query);
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.noticesService.getPublic(id);
  }
}
