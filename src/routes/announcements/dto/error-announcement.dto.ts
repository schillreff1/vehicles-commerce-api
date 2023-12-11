import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementError400 {
  @ApiProperty({ example: 400 })
  statusCode: string;

  @ApiProperty({
    example: ['typeSale must be one of the following values: sale, auction'],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class AnnouncementError404 {
  @ApiProperty({ example: 404 })
  statusCode: string;

  @ApiProperty({
    example: 'Announcement not found',
  })
  message: string;

  @ApiProperty({ example: 'Not found' })
  error: string;
}
