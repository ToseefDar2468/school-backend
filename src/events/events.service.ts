import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Event as EventModel, EventImage } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { ListEventsQueryDto } from './dto/list-events-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';

type EventWithImages = EventModel & { images: EventImage[] };

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(query: ListEventsQueryDto): Promise<EventResponseDto[]> {
    const where: Prisma.EventWhereInput = {};
    if (query.upcoming !== undefined) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.date =
        query.upcoming === true
          ? { gte: today }
          : { lt: today };
    }

    const events = await this.prisma.event.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });

    return events.map((event) => this.toResponse(event));
  }

  async getPublic(id: string): Promise<EventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return this.toResponse(event);
  }

  async create(dto: CreateEventDto): Promise<EventResponseDto> {
    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.dateISO),
        venue: dto.venue,
        coverImageUrl: dto.coverImageUrl,
        images: dto.galleryImageUrls?.length
          ? {
              createMany: {
                data: dto.galleryImageUrls.map((url) => ({ url })),
              },
            }
          : undefined,
      },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });
    return this.toResponse(event);
  }

  async update(id: string, dto: UpdateEventDto): Promise<EventResponseDto> {
    const data: Prisma.EventUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.dateISO !== undefined) data.date = new Date(dto.dateISO);
    if (dto.venue !== undefined) data.venue = dto.venue;
    if (dto.coverImageUrl !== undefined) data.coverImageUrl = dto.coverImageUrl;

    if (dto.galleryImageUrls !== undefined) {
      const galleryUrls = dto.galleryImageUrls ?? [];
      const event = await this.prisma.$transaction(async (tx) => {
        const updated = await tx.event.update({
          where: { id },
          data,
        });

        await tx.eventImage.deleteMany({ where: { eventId: id } });

        if (galleryUrls.length > 0) {
          await tx.eventImage.createMany({
            data: galleryUrls.map((url) => ({ url, eventId: id })),
          });
        }

        const withImages = await tx.event.findUnique({
          where: { id: updated.id },
          include: { images: { orderBy: { createdAt: 'asc' } } },
        });

        if (!withImages) {
          throw new NotFoundException('Event not found');
        }

        return withImages;
      });

      return this.toResponse(event);
    }

    const event = await this.prisma.event.update({
      where: { id },
      data,
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });
    return this.toResponse(event);
  }

  async remove(id: string): Promise<EventResponseDto> {
    const event = await this.prisma.event.delete({
      where: { id },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });
    return this.toResponse(event);
  }

  private toResponse(event: EventWithImages): EventResponseDto {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      dateISO: event.date.toISOString(),
      venue: event.venue,
      coverImageUrl: event.coverImageUrl,
      galleryImageUrls: event.images.map((image) => image.url),
      createdAtISO: event.createdAt.toISOString(),
      updatedAtISO: event.updatedAt.toISOString(),
    };
  }
}
