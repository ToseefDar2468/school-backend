export class EventResponseDto {
  id!: string;
  title!: string;
  description!: string;
  dateISO!: string;
  venue!: string;
  coverImageUrl!: string;
  galleryImageUrls!: string[];
  createdAtISO!: string;
  updatedAtISO!: string;
}
