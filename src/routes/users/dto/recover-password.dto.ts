import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ example: 'email@mail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SendEmailResponse {
  @ApiProperty({
    example:
      'An email has been sent with instructions for resetting your password.',
  })
  message: string;
}

export class RecoverPasswordDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RecoverPasswordEmailResponse {
  @ApiProperty({
    example: 'Successfully recovered password',
  })
  message: string;
}
