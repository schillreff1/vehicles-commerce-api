import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AnnouncementError404 } from '../announcements/dto/error-announcement.dto';
import { AuthError401 } from '../auth/dto/error-login.dto';
import { CommentsService } from './comments.service';
import {
  AllCommentsResponse,
  CommentResponse,
  CreateCommentDto,
} from './dto/create-comment.dto';
import { CommentError400, CommentError404 } from './dto/error-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Comment' })
  @ApiResponse({ status: 400, type: CommentError400 })
  @ApiResponse({ status: 401, type: AuthError401 })
  @ApiResponse({ status: 404, type: CommentError404 })
  async create(
    @Req() req: Request,
    @Param('id') announcementId: string,
    @Body() createCommentDTO: CreateCommentDto,
  ): Promise<CommentResponse> {
    return await this.commentsService.create(
      createCommentDTO,
      announcementId,
      req.user.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'List all comments' })
  @ApiResponse({ status: 404, type: AnnouncementError404 })
  async findAll(
    @Param('id') announcementId: string,
  ): Promise<AllCommentsResponse[]> {
    return await this.commentsService.findAll(announcementId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update comment' })
  @ApiResponse({ status: 400, type: CommentError400 })
  @ApiResponse({ status: 401, type: AuthError401 })
  @ApiResponse({ status: 404, type: CommentError404 })
  async update(
    @Req() req: Request,
    @Param('id') commentId: string,
    @Body() UpdateCommentsDTO: UpdateCommentDto,
  ): Promise<CommentResponse> {
    return await this.commentsService.update(
      UpdateCommentsDTO,
      commentId,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 401, type: AuthError401 })
  @ApiResponse({ status: 404, type: CommentError404 })
  @HttpCode(204)
  async remove(@Req() req: Request, @Param('id') commentId: string) {
    return await this.commentsService.remove(commentId, req.user.id);
  }
}
