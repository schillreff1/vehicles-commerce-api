import { hashSync } from 'bcryptjs';

export const mockedAddress = {
  cep: '1233456',
  state: 'Teste Teste',
  city: 'Teste Teste',
  road: 'Teste 123',
  number: '123',
};

export const mockedAddressUser = {
  email: 'testeAddress@gmail.com',
  password: hashSync('1234', 10),
  fullName: 'teste teste',
  cpf: '32132132132',
  phone: '12312312312',
  dateOfBirth: new Date('1234-12-12'),
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut ipsum vel quam congue malesuada. Proin posuere ligula in odio lobortis, et tempus dui dignissim.',
  isSeller: true,
};

export const mockedAddressLoginBody = {
  email: 'testeAddress@gmail.com',
  password: '1234',
};

export const mockedUpdateAddressBody = {
  road: '123 Teste',
};
