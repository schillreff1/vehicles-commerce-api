import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AddressesService } from '../addresses/addresses.service';

@Module({
  controllers: [AnnouncementsController],
  providers: [
    AnnouncementsService,
    UsersService,
    AddressesService,
    PrismaService,
  ],
})
export class AnnouncementsModule {}
