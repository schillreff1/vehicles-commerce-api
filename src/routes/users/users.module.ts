import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddressesService } from '../addresses/addresses.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [AddressesService, UsersService, PrismaService],
})
export class UsersModule {}
