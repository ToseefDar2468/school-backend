import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { NoticesModule } from './notices/notices.module';
import { EventsModule } from './events/events.module';
import { AlbumsModule } from './albums/albums.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const missing: string[] = [];
        if (!config.JWT_SECRET) missing.push('JWT_SECRET');
        if (!config.DATABASE_URL) missing.push('DATABASE_URL');
        if (missing.length > 0) {
          throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`,
          );
        }
        return config;
      },
    }),
    PrismaModule,
    AuthModule,
    InquiriesModule,
    NoticesModule,
    EventsModule,
    AlbumsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
