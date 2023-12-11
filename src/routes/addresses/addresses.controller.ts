import { Body, Controller, Patch, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthError401 } from '../auth/dto/error-login.dto';
import { UserError404 } from '../users/dto/error-user.dto';
import { AddressesService } from './addresses.service';
import { AddressResponse } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('address')
@Controller('address')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({ status: 401, type: AuthError401 })
  @ApiResponse({ status: 404, type: UserError404 })
  async update(
    @Req() req: Request,
    @Body() body: UpdateAddressDto,
  ): Promise<AddressResponse> {
    return await this.addressesService.update(req.user.id, body);
  }
}
