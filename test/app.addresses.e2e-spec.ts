import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { useContainer } from 'class-validator';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

import {
  mockedAddress,
  mockedAddressLoginBody,
  mockedAddressUser,
  mockedUpdateAddressBody,
} from './mocks/addresses';
import { mockedErrorResponse } from './mocks';

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
      data: { ...mockedAddressUser, addressId: address.id },
    } as any);

    await app.init();
  });

  describe('PATCH ---> /address', () => {
    it('Should not be able update without authorization token', async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch('/address')
        .send(mockedUpdateAddressBody);

      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should be able update with success', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedAddressLoginBody);

      const { body, status } = await request(app.getHttpServer())
        .patch('/address')
        .send(mockedUpdateAddressBody)
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(200);
      expect(body.road).toStrictEqual(mockedUpdateAddressBody.road);
    });
  });
});
