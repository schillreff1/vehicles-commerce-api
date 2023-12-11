import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddressesService } from '../addresses/addresses.service';
import { AnnouncementsService } from '../announcements/announcements.service';
import { UsersService } from '../users/users.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [
    CommentsService,
    UsersService,
    AddressesService,
    AnnouncementsService,
    PrismaService,
  ],
})
export class CommentsModule {}
