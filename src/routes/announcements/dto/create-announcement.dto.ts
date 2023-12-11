import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class ImageDto {
  @ApiProperty({ example: '808c1460-e8f3-470b-81d4-ef5c409595e0' })
  id: string;

  @ApiProperty({ example: 'www.image.jpg' })
  @IsUrl()
  url: string;
}

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Fiat Uno' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: ['sale', 'auction'] })
  @IsEnum({
    sale: 'sale',
    auction: 'auction',
  })
  typeSale: string;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  year: number;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  mileage: number;

  @ApiProperty({ example: '12300' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ['car', 'motorcycle'] })
  @IsEnum({
    car: 'car',
    motorcycle: 'motorcycle',
  })
  typeVehicle: string;

  @ApiProperty({ example: 'www.image.jpg' })
  @IsUrl()
  coverImage: string;

  @ApiProperty({ example: [{ url: 'www.image.jpg' }] })
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => ImageDto)
  images: ImageDto[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

export class AnnouncementUser {
  @ApiProperty({ example: '808c1460-e8f3-470b-81d4-ef5c409595e0' })
  id: string;

  @ApiProperty({ example: 'Pedro Rafael' })
  fullName: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  description: string;
}

export class AnnouncementResponse extends CreateAnnouncementDto {
  @ApiProperty({ example: '808c1460-e8f3-470b-81d4-ef5c409595e0' })
  id: string;

  @ApiProperty({ example: '2023-02-26T23:04:00.498Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-02-26T23:04:00.498Z' })
  updatedAt: Date;

  @ApiProperty({ type: () => AnnouncementUser })
  User: AnnouncementUser;
}
