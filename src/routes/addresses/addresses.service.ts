import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateAdressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async checkIfAddressExists(userId: string) {
    const addressExists = await this.prisma.address.findFirst({
      where: {
        User: { id: userId },
      },
    });
    if (!addressExists) {
      throw new NotFoundException('User not found');
    }
    return addressExists;
  }

  async create(data: CreateAdressDto) {
    try {
      return await this.prisma.address.create({ data });
    } catch {
      throw new BadRequestException('Error creating address');
    }
  }

  async update(userId: string, data: UpdateAddressDto) {
    const adressExists = await this.checkIfAddressExists(userId);

    return await this.prisma.address.update({
      data,
      where: {
        id: adressExists.id,
      },
    });
  }
}
