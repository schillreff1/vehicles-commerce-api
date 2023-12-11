import { ApiProperty } from '@nestjs/swagger';

export class UserError400 {
  @ApiProperty({ example: 400 })
  statusCode: string;

  @ApiProperty({
    example: ['email must be an email'],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class UserError404 {
  @ApiProperty({ example: 404 })
  statusCode: string;

  @ApiProperty({
    example: 'User not found',
  })
  message: string;

  @ApiProperty({ example: 'Not found' })
  error: string;
}
