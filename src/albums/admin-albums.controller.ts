import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumsService } from './albums.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/albums')
export class AdminAlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  create(@Body() body: CreateAlbumDto) {
    return this.albumsService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateAlbumDto,
  ) {
    return this.albumsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.albumsService.remove(id);
  }
}
