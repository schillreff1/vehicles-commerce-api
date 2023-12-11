import { ApiProperty } from '@nestjs/swagger';

export class CommentError400 {
  @ApiProperty({ example: 400 })
  statusCode: string;

  @ApiProperty({
    example: ['content must be a string'],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class CommentError404 {
  @ApiProperty({ example: 404 })
  statusCode: string;

  @ApiProperty({
    example: 'Comment does not exists!',
  })
  message: string;

  @ApiProperty({ example: 'Not found' })
  error: string;
}
