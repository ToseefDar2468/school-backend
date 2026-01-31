import { Injectable, NotFoundException } from '@nestjs/common';
import { Album as AlbumModel, AlbumImage, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumResponseDto } from './dto/album-response.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

type AlbumWithImages = AlbumModel & { images: AlbumImage[] };

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(): Promise<AlbumResponseDto[]> {
    const albums = await this.prisma.album.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });
    return albums.map((album) => this.toResponse(album));
  }

  async getPublic(id: string): Promise<AlbumResponseDto> {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return this.toResponse(album);
  }

  async create(dto: CreateAlbumDto): Promise<AlbumResponseDto> {
    const album = await this.prisma.album.create({
      data: {
        title: dto.title,
        category: dto.category,
        coverImageUrl: dto.coverImageUrl,
        images: dto.imageUrls?.length
          ? {
              createMany: {
                data: dto.imageUrls.map((url) => ({ url })),
              },
            }
          : undefined,
      },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });
    return this.toResponse(album);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<AlbumResponseDto> {
    const data: Prisma.AlbumUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.coverImageUrl !== undefined) data.coverImageUrl = dto.coverImageUrl;

    if (dto.imageUrls !== undefined) {
      const imageUrls = dto.imageUrls ?? [];
      const album = await this.prisma.$transaction(async (tx) => {
        const updated = await tx.album.update({
          where: { id },
          data,
        });

        await tx.albumImage.deleteMany({ where: { albumId: id } });

        if (imageUrls.length > 0) {
          await tx.albumImage.createMany({
            data: imageUrls.map((url) => ({ url, albumId: id })),
          });
        }

        const withImages = await tx.album.findUnique({
          where: { id: updated.id },
          include: { images: { orderBy: { createdAt: 'asc' } } },
        });

        if (!withImages) {
          throw new NotFoundException('Album not found');
        }

        return withImages;
      });

      return this.toResponse(album);
    }

    const album = await this.prisma.album.update({
      where: { id },
      data,
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });

    return this.toResponse(album);
  }

  async remove(id: string): Promise<AlbumResponseDto> {
    const album = await this.prisma.album.delete({
      where: { id },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });
    return this.toResponse(album);
  }

  private toResponse(album: AlbumWithImages): AlbumResponseDto {
    return {
      id: album.id,
      title: album.title,
      category: album.category,
      coverImageUrl: album.coverImageUrl,
      imageUrls: album.images.map((image) => image.url),
      createdAtISO: album.createdAt.toISOString(),
    };
  }
}
