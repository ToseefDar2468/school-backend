import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Notice as NoticeModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { ListNoticesQueryDto } from './dto/list-notices-query.dto';
import { NoticeResponseDto } from './dto/notice-response.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(query: ListNoticesQueryDto): Promise<NoticeResponseDto[]> {
    const pinnedFirst = query.pinnedFirst ?? true;
    const orderBy: Prisma.NoticeOrderByWithRelationInput[] = pinnedFirst
      ? [{ isPinned: 'desc' }, { date: 'desc' }]
      : [{ date: 'desc' }];

    const notices = await this.prisma.notice.findMany({
      orderBy,
    });

    return notices.map((notice) => this.toResponse(notice));
  }

  async getPublic(id: string): Promise<NoticeResponseDto> {
    const notice = await this.prisma.notice.findUnique({ where: { id } });
    if (!notice) {
      throw new NotFoundException('Notice not found');
    }
    return this.toResponse(notice);
  }

  async create(dto: CreateNoticeDto): Promise<NoticeResponseDto> {
    const notice = await this.prisma.notice.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.dateISO),
        isPinned: dto.isPinned,
        attachmentUrl: dto.attachmentUrl,
      },
    });
    return this.toResponse(notice);
  }

  async update(id: string, dto: UpdateNoticeDto): Promise<NoticeResponseDto> {
    const data: Prisma.NoticeUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.dateISO !== undefined) data.date = new Date(dto.dateISO);
    if (dto.isPinned !== undefined) data.isPinned = dto.isPinned;
    if (dto.attachmentUrl !== undefined) data.attachmentUrl = dto.attachmentUrl;

    const notice = await this.prisma.notice.update({
      where: { id },
      data,
    });
    return this.toResponse(notice);
  }

  async remove(id: string): Promise<NoticeResponseDto> {
    const notice = await this.prisma.notice.delete({ where: { id } });
    return this.toResponse(notice);
  }

  private toResponse(notice: NoticeModel): NoticeResponseDto {
    return {
      id: notice.id,
      title: notice.title,
      description: notice.description,
      dateISO: notice.date.toISOString(),
      isPinned: notice.isPinned,
      attachmentUrl: notice.attachmentUrl,
      createdAtISO: notice.createdAt.toISOString(),
      updatedAtISO: notice.updatedAt.toISOString(),
    };
  }
}
