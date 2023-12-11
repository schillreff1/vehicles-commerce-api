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
import { CreateUserDto, CreateUserResponse } from './dto/create-user.dto';
import { UserError400, UserError404 } from './dto/error-user.dto';
import {
  RecoverPasswordDto,
  RecoverPasswordEmailResponse,
  SendEmailDto,
  SendEmailResponse,
} from './dto/recover-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 400, type: UserError400 })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List user' })
  @ApiResponse({ status: 401, type: AuthError401 })
  @ApiResponse({ status: 404, type: UserError404 })
  async findUnique(@Req() req: Request): Promise<CreateUserResponse> {
    return await this.usersService.findUnique(req.user.id);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 400, type: UserError400 })
  @ApiResponse({ status: 401, type: AuthError401 })
  @ApiResponse({ status: 404, type: UserError404 })
  async update(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<CreateUserResponse> {
    return await this.usersService.update(updateUserDto, req.user.id);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 401, type: AuthError401 })
  @ApiResponse({ status: 404, type: UserError404 })
  @HttpCode(204)
  async remove(@Req() req: Request): Promise<CreateUserResponse> {
    return await this.usersService.remove(req.user.id);
  }

  @Post('/recover-password')
  @ApiOperation({ summary: 'SendEmail' })
  @ApiResponse({ status: 400, type: UserError400 })
  @ApiResponse({ status: 404, type: UserError404 })
  async sendEmailRecoverPassword(
    @Body() recoverPasswordDto: SendEmailDto,
  ): Promise<SendEmailResponse> {
    return await this.usersService.sendEmailRecoverPassword(
      recoverPasswordDto.email,
    );
  }

  @Patch('/recover-password/:token')
  @ApiOperation({ summary: 'Recovery Password' })
  @ApiResponse({ status: 400, type: UserError400 })
  @ApiResponse({ status: 404, type: UserError404 })
  async recoverPassword(
    @Param('token') token: string,
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ): Promise<RecoverPasswordEmailResponse> {
    return await this.usersService.recoverPassword(
      token,
      recoverPasswordDto.password,
    );
  }
}
