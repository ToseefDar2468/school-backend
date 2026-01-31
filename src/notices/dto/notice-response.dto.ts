export class NoticeResponseDto {
  id!: string;
  title!: string;
  description!: string;
  dateISO!: string;
  isPinned!: boolean;
  attachmentUrl?: string | null;
  createdAtISO!: string;
  updatedAtISO!: string;
}
