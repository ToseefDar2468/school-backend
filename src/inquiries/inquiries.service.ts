import { Injectable } from '@nestjs/common';
import { InquiryStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryQueryDto } from './dto/inquiry-query.dto';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateInquiryDto) {
    return this.prisma.inquiry.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
      },
    });
  }

  findAll(query: InquiryQueryDto) {
    const where: Prisma.InquiryWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { message: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: string, status: InquiryStatus) {
    return this.prisma.inquiry.update({
      where: { id },
      data: { status },
    });
  }
}
