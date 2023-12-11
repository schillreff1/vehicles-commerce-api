import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdressDto {
  @ApiProperty({ example: '000000-000' })
  @IsString()
  @IsNotEmpty()
  cep: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Road one' })
  @IsString()
  @IsNotEmpty()
  road: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'House' })
  @IsOptional()
  @IsString()
  complement?: string;
}

export class AddressResponse extends CreateAdressDto {
  @ApiProperty({ example: '808c1460-e8f3-470b-81d4-ef5c409595e0' })
  id: string;
}
