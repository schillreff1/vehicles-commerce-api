import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockedErrorResponse } from './mocks';
import {
  invalidMockedCpf,
  invalidMockedEmail,
  invalidMockedPasswordConfirmation,
  mockedValidLoginBody2,
  mockedValidLoginBody3,
  updateCPFInvalidData,
  updateEmailInvalidData,
  updatePasswordData,
  validMockedUser2,
  validMockedUser3,
  voidUser,
  voidUserErrorResponse,
} from './mocks/users';

describe('Users Routes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
  });

  describe('POST ---> /users', () => {
    it('Should not be able to create a user without required fields', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/users')
        .send(voidUser);

      expect(status).toBe(400);
      expect(body).toStrictEqual(voidUserErrorResponse);
    });

    it('Should be able to create a user', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/users')
        .send(validMockedUser2);

      expect(status).toBe(201);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('email');
      expect(body).toHaveProperty('fullName');
      expect(body).toHaveProperty('cpf');
      expect(body).toHaveProperty('phone');
      expect(body).toHaveProperty('dateOfBirth');
      expect(body).toHaveProperty('description');
      expect(body).toHaveProperty('isSeller');
      expect(body).toHaveProperty('createdAt');
      expect(body).toHaveProperty('updatedAt');
      expect(body.Address).toHaveProperty('id');
      expect(body.Address).toHaveProperty('cep');
      expect(body.Address).toHaveProperty('state');
      expect(body.Address).toHaveProperty('city');
      expect(body.Address).toHaveProperty('road');
      expect(body.Address).toHaveProperty('number');
      expect(body.Address).toHaveProperty('complement');
    });

    it('Should not be able to create a user if e-mail is already registered', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/users')
        .send(invalidMockedEmail);

      expect(status).toBe(400);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should not be able to create a user if CPF is already registered', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/users')
        .send(invalidMockedCpf);

      expect(status).toBe(400);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it("Should not be able to create a user if password confirmation doesn't match with password", async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/users')
        .send(invalidMockedPasswordConfirmation);

      expect(status).toBe(400);
      expect(body).toStrictEqual(mockedErrorResponse);
    });
  });

  describe('GET ---> /users', () => {
    it('Should not be able to retrieve user without token', async () => {
      const { status, body } = await request(app.getHttpServer()).get('/users');

      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should be able to retrieve user', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedValidLoginBody2);

      const { status, body } = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(200);
      expect(body).toHaveProperty('id');
      expect(body.Address).toHaveProperty('id');
    });
  });

  describe('Patch ---> /users', () => {
    it('Should not be able to update user without token', async () => {
      const { status, body } = await request(app.getHttpServer()).patch(
        '/users',
      );

      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should not be able to update password in this route', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedValidLoginBody2);

      const { status, body } = await request(app.getHttpServer())
        .patch('/users')
        .send(updatePasswordData)
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(400);
      expect(body).toStrictEqual(voidUserErrorResponse);
    });

    it("Should not be able to update e-mail if it's already registered", async () => {
      await request(app.getHttpServer()).post('/users').send(validMockedUser3);

      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedValidLoginBody2);

      const { status, body } = await request(app.getHttpServer())
        .patch('/users')
        .send(updateEmailInvalidData)
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(400);
      expect(body).toStrictEqual(voidUserErrorResponse);
    });

    it("Should not be able to update CPF if it's already registered", async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedValidLoginBody2);

      const { status, body } = await request(app.getHttpServer())
        .patch('/users')
        .send(updateCPFInvalidData)
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(400);
      expect(body).toStrictEqual(voidUserErrorResponse);
    });
  });

  describe('DELETE ---> /users', () => {
    it('Should not be able to delete user without token', async () => {
      const { status, body } = await request(app.getHttpServer()).delete(
        '/users',
      );

      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should be able to delete user', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedValidLoginBody3);

      const { status } = await request(app.getHttpServer())
        .delete('/users')
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(204);
    });

    it('Should not be able to delete a deleted user', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedValidLoginBody3);

      const { status, body } = await request(app.getHttpServer())
        .delete('/users')
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });
  });
});
