import { PartialType } from '@nestjs/swagger';
import { CreateAdressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAdressDto) {}
