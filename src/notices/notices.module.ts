import { Module } from '@nestjs/common';
import { AdminNoticesController } from './admin-notices.controller';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';

@Module({
  controllers: [NoticesController, AdminNoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
