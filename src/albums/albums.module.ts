import { Module } from '@nestjs/common';
import { AdminAlbumsController } from './admin-albums.controller';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

@Module({
  controllers: [AlbumsController, AdminAlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
