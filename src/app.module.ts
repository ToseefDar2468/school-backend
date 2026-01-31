import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { NoticesModule } from './notices/notices.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    InquiriesModule,
    NoticesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
