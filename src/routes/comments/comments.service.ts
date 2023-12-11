import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { exclude } from '../../utils/exclude-keys';
import { AnnouncementsService } from '../announcements/announcements.service';
import { UsersService } from '../users/users.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private user: UsersService,
    private announcement: AnnouncementsService,
  ) {}

  async create(body: CreateCommentDto, announcementId: string, userId: string) {
    const { ...data } = body;

    await this.user.findUnique(userId);

    await this.announcement.findUnique(announcementId);

    const comment = await this.prisma.comment.create({
      data: { ...data, announcementId: announcementId, userId: userId },
    });

    return exclude(comment, ['userId', 'announcementId']);
  }

  async findUnique(commentId: string) {
    const commentExists = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!commentExists) {
      throw new NotFoundException('Comment not found');
    }
    return commentExists;
  }

  async findAll(announcementId: string) {
    await this.announcement.findUnique(announcementId);

    const comments = await this.prisma.comment.findMany({
      where: {
        announcementId,
      },
      include: {
        User: { select: { id: true, fullName: true, phone: true } },
      },
    });

    return comments.map((comment) => {
      return exclude(comment, ['userId', 'announcementId']);
    });
  }

  async update(body: UpdateCommentDto, commentId: string, userId: string) {
    const { ...data } = body;

    const commentExists = await this.findUnique(commentId);

    await this.user.findUnique(userId);

    if (commentExists.userId !== userId) {
      throw new BadRequestException('Comment does not belong to the user');
    }

    const updatedComment = await this.prisma.comment.update({
      data,
      where: {
        id: commentId,
      },
    });

    return exclude(updatedComment, ['userId', 'announcementId']);
  }

  async remove(commentId: string, userId: string) {
    const commentExists = await this.findUnique(commentId);

    await this.user.findUnique(userId);

    if (commentExists.userId !== userId) {
      throw new BadRequestException('Comment does not belong to the user');
    }

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return true;
  }
}
