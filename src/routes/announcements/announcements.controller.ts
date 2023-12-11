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
import { AuthError401 } from '../auth/dto/error-login.dto';
import { UserError404 } from '../users/dto/error-user.dto';
import { AnnouncementsService } from './announcements.service';
import {
  AnnouncementResponse,
  CreateAnnouncementDto,
} from './dto/create-announcement.dto';
import {
  AnnouncementError400,
  AnnouncementError404,
} from './dto/error-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@ApiTags('announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementService: AnnouncementsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create announcement' })
  @ApiResponse({
    status: 400,
    type: AnnouncementError400,
  })
  @ApiResponse({
    status: 401,
    type: AuthError401,
  })
  @ApiResponse({
    status: 404,
    type: UserError404,
  })
  async create(
    @Req() req: Request,
    @Body() createAnnouncementDTO: CreateAnnouncementDto,
  ): Promise<AnnouncementResponse> {
    return await this.announcementService.create(
      createAnnouncementDTO,
      req.user.id,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all announcements' })
  async findAll(): Promise<AnnouncementResponse[]> {
    return await this.announcementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'List one announcement' })
  @ApiResponse({
    status: 404,
    type: AnnouncementError404,
  })
  async findUnique(@Param('id') id: string): Promise<AnnouncementResponse> {
    return await this.announcementService.findUnique(id);
  }

  @Get('/seller/:id')
  @ApiOperation({ summary: 'List all announcement seller' })
  @ApiResponse({
    status: 404,
    type: UserError404,
  })
  async findAllSeller(
    @Param('id') id: string,
  ): Promise<AnnouncementResponse[]> {
    return await this.announcementService.findAllSeller(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update announcement' })
  @ApiResponse({
    status: 400,
    type: AnnouncementError400,
  })
  @ApiResponse({
    status: 401,
    type: AuthError401,
  })
  @ApiResponse({
    status: 404,
    type: AnnouncementError404,
  })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateAnnouncementDTO: UpdateAnnouncementDto,
  ): Promise<AnnouncementResponse> {
    return await this.announcementService.update(
      id,
      updateAnnouncementDTO,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete announcement' })
  @ApiResponse({
    status: 401,
    type: AuthError401,
  })
  @ApiResponse({
    status: 404,
    type: AnnouncementError404,
  })
  @HttpCode(204)
  async delete(@Req() req: Request, @Param('id') id: string) {
    return await this.announcementService.delete(id, req.user.id);
  }
}
