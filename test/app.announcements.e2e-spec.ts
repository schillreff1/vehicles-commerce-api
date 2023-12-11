import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

import { mockedErrorResponse, mockedRequiredFieldsResponse } from './mocks';
import {
  mockedAnnouncement,
  mockedUserAdvertiser,
  mockedUserAdvertiserLogin,
  mockedUserNotAdvertiser,
  mockedUserNotAdvertiserLogin,
} from './mocks/announcements';

describe('Integration Tests: Announcements Routes', () => {
  let app: INestApplication;

  let advertiserToken = '';
  let notAdvertiserToken = '';
  let announcementCreatedId = '';
  let advertiserId = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    const user = await request(app.getHttpServer())
      .post('/users')
      .send(mockedUserAdvertiser);

    const { body } = await request(app.getHttpServer())
      .post('/login')
      .send(mockedUserAdvertiserLogin);
    advertiserToken = body.token;
    advertiserId = user.body.id;

    await request(app.getHttpServer())
      .post('/users')
      .send(mockedUserNotAdvertiser);
    const notAdvertiser = await request(app.getHttpServer())
      .post('/login')
      .send(mockedUserNotAdvertiserLogin);
    notAdvertiserToken = notAdvertiser.body.token;
  });

  describe('POST ---> /announcements', () => {
    it('Should not be able create without authorization token', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/announcements')
        .send(mockedAnnouncement);
      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should not be able create with not advertiser', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/announcements')
        .send(mockedAnnouncement)
        .set('Authorization', `Bearer ${notAdvertiserToken}`);
      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should not be able create with empty field', async () => {
      const { title, ...data } = mockedAnnouncement;
      const { status, body } = await request(app.getHttpServer())
        .post('/announcements')
        .send(data)
        .set('Authorization', `Bearer ${advertiserToken}`);
      expect(status).toBe(400);
      expect(body).toStrictEqual(mockedRequiredFieldsResponse);
    });

    it('Should be able create with success', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/announcements')
        .send(mockedAnnouncement)
        .set('Authorization', `Bearer ${advertiserToken}`);
      announcementCreatedId = body.id;
      expect(status).toBe(201);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('title');
      expect(body).toHaveProperty('typeSale');
      expect(body).toHaveProperty('year');
      expect(body).toHaveProperty('mileage');
      expect(body).toHaveProperty('description');
      expect(body).toHaveProperty('price');
      expect(body).toHaveProperty('typeVehicle');
      expect(body).toHaveProperty('coverImage');
      expect(body).toHaveProperty('images');
    });
  });

  describe('GET ---> /announcements', () => {
    it('Should not be able  get one announcement  with invalid id', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/announcements/${'invalidId'}`,
      );
      expect(status).toBe(404);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should not be able get all announcements with invalid seller id', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/announcements/seller/${'invalidId'}`,
      );
      expect(status).toBe(404);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should be able get one announcement', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/announcements/${announcementCreatedId}`,
      );
      expect(status).toBe(200);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('title');
      expect(body).toHaveProperty('typeSale');
      expect(body).toHaveProperty('year');
      expect(body).toHaveProperty('mileage');
      expect(body).toHaveProperty('description');
      expect(body).toHaveProperty('price');
      expect(body).toHaveProperty('typeVehicle');
      expect(body).toHaveProperty('coverImage');
      expect(body).toHaveProperty('images');
    });

    it('Should be able get all announcements', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/announcements`,
      );
      expect(status).toBe(200);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('title');
      expect(body[0]).toHaveProperty('typeSale');
      expect(body[0]).toHaveProperty('year');
      expect(body[0]).toHaveProperty('mileage');
      expect(body[0]).toHaveProperty('description');
      expect(body[0]).toHaveProperty('price');
      expect(body[0]).toHaveProperty('typeVehicle');
      expect(body[0]).toHaveProperty('coverImage');
      expect(body[0]).toHaveProperty('images');
    });

    it('Should be able get all announcements with valid seller id', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/announcements/seller/${advertiserId}`,
      );
      expect(status).toBe(200);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('title');
      expect(body[0]).toHaveProperty('typeSale');
      expect(body[0]).toHaveProperty('year');
      expect(body[0]).toHaveProperty('mileage');
      expect(body[0]).toHaveProperty('description');
      expect(body[0]).toHaveProperty('price');
      expect(body[0]).toHaveProperty('typeVehicle');
      expect(body[0]).toHaveProperty('coverImage');
      expect(body[0]).toHaveProperty('images');
    });
  });

  describe('PATCH ---> /announcements', () => {
    it('Should not be able update without authorization token', async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch(`/announcements/${announcementCreatedId}`)
        .send(mockedAnnouncement);
      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should not be able update with not advertiser', async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch(`/announcements/${announcementCreatedId}`)
        .send(mockedAnnouncement)
        .set('Authorization', `Bearer ${notAdvertiserToken}`);
      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should be able update with success', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/announcements')
        .send(mockedAnnouncement)
        .set('Authorization', `Bearer ${advertiserToken}`);
      expect(status).toBe(201);
    });
  });

  describe('Delete ---> /announcements', () => {
    it('Should not be able delete announcement not advertiser', async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`/announcements/${announcementCreatedId}`)
        .set('Authorization', `Bearer ${notAdvertiserToken}`);
      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should not be able delete announcement with invalid id', async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`/announcements/${'invalidId'}`)
        .set('Authorization', `Bearer ${advertiserToken}`);
      expect(status).toBe(404);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should be able delete announcement', async () => {
      const { status } = await request(app.getHttpServer())
        .delete(`/announcements/${announcementCreatedId}`)
        .set('Authorization', `Bearer ${advertiserToken}`);
      expect(status).toBe(204);
    });

    it('Should not be able get one announcement deleted', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/announcements/${announcementCreatedId}`,
      );
      expect(status).toBe(404);
      expect(body).toStrictEqual(mockedErrorResponse);
    });
  });
});
