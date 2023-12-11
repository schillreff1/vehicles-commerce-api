import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { exclude } from '../../utils/exclude-keys';
import { UsersService } from '../users/users.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService, private user: UsersService) {}

  async create(createAnnouncementDTO: CreateAnnouncementDto, userId: string) {
    const { images, ...data } = createAnnouncementDTO;

    await this.user.findUnique(userId);

    const createdAnnouncement = await this.prisma.announcement.create({
      data: { ...data, userId: userId },
    });

    images.forEach(async (image) => {
      await this.prisma.image.create({
        data: { url: image.url, announcementId: createdAnnouncement.id },
      });
    });

    const announcement = await this.prisma.announcement.findUnique({
      where: { id: createdAnnouncement.id },
      include: {
        images: { select: { id: true, url: true } },
        User: { select: { id: true, fullName: true, description: true } },
      },
    });

    return exclude(announcement, ['userId']);
  }

  async findAll() {
    const announcements = await this.prisma.announcement.findMany({
      where: { isActive: true },
      include: {
        images: { select: { id: true, url: true } },
        User: { select: { id: true, fullName: true, description: true } },
      },
    });

    return announcements.map((announcement) => {
      return exclude(announcement, ['userId']);
    });
  }

  async findUnique(id: string) {
    const announcementExists = await this.prisma.announcement.findUnique({
      where: {
        id,
      },
      include: {
        images: { select: { id: true, url: true } },
        User: {
          select: { id: true, fullName: true, description: true, phone: true },
        },
      },
    });

    if (!announcementExists) {
      throw new NotFoundException('Announcement not found');
    }

    return exclude(announcementExists, ['userId']);
  }

  async findAllSeller(userId: string) {
    await this.user.findUnique(userId);

    const announcements = await this.prisma.announcement.findMany({
      where: { userId },
      include: {
        images: { select: { id: true, url: true } },
        User: { select: { id: true, fullName: true, description: true } },
      },
    });

    return announcements.map((announcement) => {
      return exclude(announcement, ['userId']);
    });
  }

  async update(
    id: string,
    updateAnnouncementDTO: UpdateAnnouncementDto,
    userId: string,
  ) {
    const { images, ...data } = updateAnnouncementDTO;

    const announcementExists = await this.findUnique(id);

    if (announcementExists.User.id !== userId) {
      throw new UnauthorizedException('User dont have permission');
    }

    if (images) {
      await this.prisma.image.deleteMany({
        where: { announcementId: announcementExists.id },
      });

      images.forEach(async (image) => {
        await this.prisma.image.create({
          data: { url: image.url, announcementId: announcementExists.id },
        });
      });
    }

    const announcement = await this.prisma.announcement.update({
      data,
      where: {
        id,
      },
      include: {
        images: { select: { id: true, url: true } },
        User: { select: { id: true, fullName: true, description: true } },
      },
    });

    return exclude(announcement, ['userId']);
  }

  async delete(id: string, userId: string) {
    const announcementExists = await this.findUnique(id);

    if (announcementExists.User.id !== userId) {
      throw new UnauthorizedException('User dont have permission');
    }

    await this.prisma.announcement.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
