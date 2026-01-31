import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');

    if (!email || !password) return;

    const existing = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existing) return;

    const passwordHash = await bcrypt.hash(password, 12);
    await this.prisma.admin.create({
      data: {
        email,
        passwordHash,
      },
    });
  }
}
