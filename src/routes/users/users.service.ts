import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service';
import { exclude } from '../../utils/exclude-keys';
import { AddressesService } from '../addresses/addresses.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

dotenv.config();

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private address: AddressesService,
  ) {}

  async checkIfEmailExists(email: string) {
    const emailExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (emailExists) {
      throw new BadRequestException('E-mail already registered');
    }
  }

  async checkIfCpfExists(cpf: string) {
    const cpfExists = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });
    if (cpfExists) {
      throw new BadRequestException('CPF already registered');
    }
  }

  async create(body: CreateUserDto) {
    const { address, confirmPassword, ...data } = body;

    await this.checkIfEmailExists(data.email);

    await this.checkIfCpfExists(data.cpf);

    if (data.password !== confirmPassword) {
      throw new BadRequestException(
        'Password confirmation is different from password',
      );
    }

    const createdAddress = await this.address.create(address);

    const salt = genSaltSync(10);
    data.password = hashSync(data.password, salt);

    data.dateOfBirth = new Date(data.dateOfBirth);

    const createdUser = await this.prisma.user.create({
      data: { ...data, addressId: createdAddress.id },
      include: {
        Address: true,
      },
    });
    return exclude(createdUser, ['password', 'addressId']);
  }

  async findUnique(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Address: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return exclude(user, ['password', 'addressId']);
  }

  async update(data: UpdateUserDto, userId: string) {
    const userExists = await this.findUnique(userId);

    if (data.email && data.email != userExists.email) {
      await this.checkIfEmailExists(data.email);
    }

    if (data.cpf && data.cpf != userExists.cpf) {
      await this.checkIfCpfExists(data.cpf);
    }

    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    const updateddUser = await this.prisma.user.update({
      data,
      where: { id: userId },
      include: { Address: true },
    });

    return exclude(updateddUser, ['password', 'addressId']);
  }

  async remove(userId: string) {
    await this.findUnique(userId);

    const deletedUser = await this.prisma.user.delete({
      where: { id: userId },
      include: { Address: true },
    });

    return exclude(deletedUser, ['password', 'addressId']);
  }

  async sendEmailRecoverPassword(email: string) {
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userExists) {
      throw new NotFoundException('Email not found');
    }

    const tokenExists = await this.prisma.recoverPassword.findUnique({
      where: { userId: userExists.id },
    });

    let token = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: '30m',
    });

    if (!tokenExists) {
      await this.prisma.recoverPassword.create({
        data: { token, userId: userExists.id },
      });
    } else {
      token = tokenExists.token;
    }

    const mail = {
      to: userExists.email,
      from: 'contato@motorsshop.com',
      subject: 'Email de recuperação',
      template: 'recover-password',
      context: {
        baseURL: process.env.BASE_URL,
        token: token,
      },
    };

    try {
      await this.mailerService.sendMail(mail);
    } catch {
      throw new BadRequestException('Error sending email');
    }

    return {
      message:
        'An email has been sent with instructions for resetting your password.',
    };
  }

  async recoverPassword(token: string, newPassword: string) {
    const tokenExists = await this.prisma.recoverPassword.findUnique({
      where: { token },
      select: {
        userId: true,
      },
    });

    if (!tokenExists) {
      throw new NotFoundException('Invalid token');
    }

    let deleteToken = false;

    jwt.verify(token, process.env.SECRET_KEY, (err: any, decoded: any) => {
      if (err || !decoded) {
        deleteToken = true;
      }
    });

    if (deleteToken) {
      await this.prisma.recoverPassword.delete({
        where: { token },
      });
      throw new UnauthorizedException('Expired token, send another email');
    }

    const salt = genSaltSync(10);
    const password = hashSync(newPassword, salt);

    await this.prisma.user.update({
      where: { id: tokenExists.userId },
      data: {
        password: password,
      },
    });

    await this.prisma.recoverPassword.delete({
      where: { token },
    });

    return {
      message: 'Successfully recovered password',
    };
  }
}
