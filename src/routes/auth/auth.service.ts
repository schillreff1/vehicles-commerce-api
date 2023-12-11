import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login-dto';

dotenv.config();
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid e-mail or password');
    }

    const passwordMatches = await bcryptjs.compare(password, user.password);

    if (!passwordMatches) {
      throw new BadRequestException('Invalid e-mail or password');
    }

    const token = jwt.sign(
      {
        isSeller: user.isSeller,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1d',
        subject: user.id,
      },
    );

    return { token };
  }
}
