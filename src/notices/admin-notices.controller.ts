import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticesService } from './notices.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/notices')
export class AdminNoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  create(@Body() body: CreateNoticeDto) {
    return this.noticesService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateNoticeDto,
  ) {
    return this.noticesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.noticesService.remove(id);
  }
}
