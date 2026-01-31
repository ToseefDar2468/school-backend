import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  list() {
    return this.albumsService.listPublic();
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.albumsService.getPublic(id);
  }
}
