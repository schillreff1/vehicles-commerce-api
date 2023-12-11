import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur dipiscing elit.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CommentResponse extends CreateCommentDto {
  @ApiProperty({ example: '808c1460-e8f3-470b-81d4-ef5c409595e0' })
  id: string;

  @ApiProperty({ example: '2023-03-01T23:51:00.587Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-03-01T23:51:00.587Z' })
  updatedAt: Date;
}

export class CommentUser {
  @ApiProperty({ example: '808c1460-e8f3-470b-81d4-ef5c409595e0' })
  public id: string;

  @ApiProperty({ example: 'Pedro Rafael' })
  public fullName: string;

  @ApiProperty({ example: '(00) 00000-0000' })
  public phone: string;
}

export class AllCommentsResponse extends CommentResponse {
  @ApiProperty({ type: () => CommentUser })
  User: CommentUser;
}
