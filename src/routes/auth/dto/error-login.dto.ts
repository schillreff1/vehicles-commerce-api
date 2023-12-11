import { ApiProperty } from '@nestjs/swagger';

export class LoginError400 {
  @ApiProperty({ example: 400 })
  statusCode: string;

  @ApiProperty({
    example: 'Invalid e-mail or password!',
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class AuthError401 {
  @ApiProperty({ example: 401 })
  statusCode: string;

  @ApiProperty({
    example: 'Invalid token',
  })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}
