import { hashSync } from 'bcryptjs';
import 'jest-extended';

export const validMockedUser = {
  email: 'teste@gmail.com',
  password: hashSync('1234', 10),
  fullName: 'teste teste',
  cpf: '12312312312',
  phone: '12312312312',
  dateOfBirth: new Date('1234-12-12'),
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut ipsum vel quam congue malesuada. Proin posuere ligula in odio lobortis, et tempus dui dignissim.',
  isSeller: true,
};

export const validMockedUser2 = {
  email: 'teste2@gmail.com',
  password: '1234',
  confirmPassword: '1234',
  fullName: 'teste2 da silva',
  dateOfBirth: '1988-02-02',
  cpf: '22222222222',
  phone: '22222222222',
  isSeller: true,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut ipsum vel quam congue malesuada. Proin posuere ligula in odio lobortis, et tempus dui dignissim.',
  address: {
    cep: '00000',
    city: 'recife',
    state: 'pernambuco',
    number: '526',
    road: 'qualquer',
  },
};

export const mockedValidLoginBody2 = {
  email: 'teste2@gmail.com',
  password: '1234',
};

export const validMockedUser3 = {
  email: 'teste3@gmail.com',
  password: '1234',
  confirmPassword: '1234',
  fullName: 'teste3 da silva',
  dateOfBirth: '1988-02-02',
  cpf: '33333333333',
  phone: '33333333333',
  isSeller: true,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut ipsum vel quam congue malesuada. Proin posuere ligula in odio lobortis, et tempus dui dignissim.',
  address: {
    cep: '00000',
    city: 'recife',
    state: 'pernambuco',
    number: '526',
    road: 'qualquer',
  },
};

export const mockedValidLoginBody3 = {
  email: 'teste3@gmail.com',
  password: '1234',
};

export const invalidMockedEmail = {
  email: 'teste2@gmail.com',
  password: '1234',
  confirmPassword: '1234',
  fullName: 'e-mail repetido da silva',
  dateOfBirth: '1988-02-02',
  cpf: '99999999999',
  phone: '99999999999',
  isSeller: true,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut ipsum vel quam congue malesuada. Proin posuere ligula in odio lobortis, et tempus dui dignissim.',
  address: {
    cep: '00000',
    city: 'recife',
    state: 'pernambuco',
    number: '526',
    road: 'qualquer',
  },
};

export const invalidMockedCpf = {
  email: 'cpfrepetido@gmail.com',
  password: '1234',
  confirmPassword: '1234',
  fullName: 'cpf repetido da silva',
  dateOfBirth: '1988-02-02',
  cpf: '22222222222',
  phone: '99999999999',
  isSeller: true,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut ipsum vel quam congue malesuada. Proin posuere ligula in odio lobortis, et tempus dui dignissim.',
  address: {
    cep: '00000',
    city: 'recife',
    state: 'pernambuco',
    number: '526',
    road: 'qualquer',
  },
};

export const invalidMockedPasswordConfirmation = {
  email: 'passwordsdontmatch@gmail.com',
  password: '1234',
  confirmPassword: '4321',
  fullName: 'passwordsdontmatch',
  dateOfBirth: '1988-02-02',
  cpf: '55555555555',
  phone: '55555555555',
  isSeller: true,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut ipsum vel quam congue malesuada. Proin posuere ligula in odio lobortis, et tempus dui dignissim.',
  address: {
    cep: '00000',
    city: 'recife',
    state: 'pernambuco',
    number: '526',
    road: 'qualquer',
  },
};

export const voidUser = {};

export const voidUserErrorResponse = expect.objectContaining({
  statusCode: expect.any(Number),
  message: expect.arrayContaining([expect.any(String)]),
  error: expect.any(String),
});

export const updateUserData = {
  fullName: 'teste2 da silva editado',
  email: 'teste2editado@gmail.com',
};

export const updateEmailInvalidData = {
  email: 'teste3@gmail.com',
};

export const updateCPFInvalidData = {
  cpf: '33333333333',
};

export const updatePasswordData = {
  password: '4321',
};
