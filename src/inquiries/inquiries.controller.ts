import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryQueryDto } from './dto/inquiry-query.dto';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';
import { InquiriesService } from './inquiries.service';

@Controller()
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post('inquiries')
  create(@Body() body: CreateInquiryDto) {
    return this.inquiriesService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/inquiries')
  findAll(@Query() query: InquiryQueryDto) {
    return this.inquiriesService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/inquiries/:id/status')
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateInquiryStatusDto,
  ) {
    return this.inquiriesService.updateStatus(id, body.status);
  }
}
