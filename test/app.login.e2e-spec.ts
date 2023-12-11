import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { useContainer } from 'class-validator';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

import { validMockedUser } from './mocks/users';
import { mockedAddress } from './mocks/addresses';
import { mockedErrorResponse, mockedRequiredFieldsResponse } from './mocks';
import {
  mockedInvalidLoginBody,
  mockedValidLoginBody,
  mockedToken,
} from './mocks/login';

describe('Integration Tests: Addresses Routes', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const address = await prisma.address.create({
      data: mockedAddress,
    });

    await prisma.user.create({
      data: { ...validMockedUser, addressId: address.id },
    } as any);

    await app.init();
  });

  describe('POST ---> /login', () => {
    it('Should not be able login without required fields', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/login')
        .send({});

      expect(status).toBe(400);
      expect(body).toStrictEqual(mockedRequiredFieldsResponse);
    });

    it('Should not be able login with invalid e-mail', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedInvalidLoginBody('e-mail'));

      expect(status).toBe(400);
      expect(body).toStrictEqual(mockedErrorResponse);
      expect(body.message).toBe('Invalid e-mail or password');
    });

    it('Should not be able login with invalid password', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedInvalidLoginBody('password'));

      expect(status).toBe(400);
      expect(body).toStrictEqual(mockedErrorResponse);
      expect(body.message).toBe('Invalid e-mail or password');
    });

    it('Should be able login with success', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedValidLoginBody);

      expect(status).toBe(200);
      expect(body).toStrictEqual(mockedToken);
    });
  });
});
