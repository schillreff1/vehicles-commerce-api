import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';

import {
  AddressResponse,
  CreateAdressDto,
} from '../../addresses/dto/create-address.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'email@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @ApiProperty({ example: 'Leandro Schillreff' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: '000.000.000-00' })
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @ApiProperty({ example: '(00) 00000-0000' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: '2000-02-23' })
  @IsDateString()
  dateOfBirth: Date;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsBoolean()
  isSeller: boolean;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateAdressDto)
  address: CreateAdressDto;
}

export class CreateUserResponse extends OmitType(CreateUserDto, [
  'address',
  'password',
  'confirmPassword',
]) {
  @ApiProperty({ example: '008c1460-e8f3-470b-81d4-ef5c409595e0' })
  id: string;

  @ApiProperty({ example: '2023-02-26T23:04:00.498Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-02-26T23:04:00.498Z' })
  updatedAt: Date;

  @ApiProperty({ type: () => AddressResponse })
  Address: AddressResponse;
}
