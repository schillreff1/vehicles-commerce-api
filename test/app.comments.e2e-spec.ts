import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { PrismaService } from '../src/prisma/prisma.service';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { mockedErrorResponse, mockedRequiredFieldsResponse } from './mocks';
import { mockedAddress } from './mocks/addresses';
import {
  mockedAnnouncementComment,
  mockedComment,
  mockedCommentBody,
  mockedImageComment,
  mockedUserComment1,
  mockedUserComment2,
  mockedUserCommentLogin1,
  updateCommentBody,
  mockedUserCommentLogin2,
} from './mocks/comments';

describe('Integration Tests: Comments Routes', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let announcementId: string;
  let commentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const address1 = await prisma.address.create({
      data: mockedAddress,
    });

    const user = await prisma.user.create({
      data: { ...mockedUserComment1, addressId: address1.id },
    } as any);

    const announcement = await prisma.announcement.create({
      data: { ...mockedAnnouncementComment, userId: user.id },
    } as any);

    announcementId = announcement.id;

    await prisma.image.create({
      data: {
        ...mockedImageComment,
        announcementId,
      },
    } as any);

    const address2 = await prisma.address.create({
      data: mockedAddress,
    });

    await prisma.user.create({
      data: { ...mockedUserComment2, addressId: address2.id },
    } as any);

    await app.init();
  });

  describe('POST ---> /comments/:announcementId', () => {
    it('Should not be able to create a comment without authorization token', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(`/comments/${announcementId}`)
        .send(mockedCommentBody);
      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should not be able create a comment with invalid announcement', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedUserCommentLogin1);

      const { status, body } = await request(app.getHttpServer())
        .post('/comments/1')
        .send(mockedCommentBody)
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(404);
      expect(body).toStrictEqual(mockedErrorResponse);
      expect(body.message).toBe('Announcement not found');
    });

    it('Should not be able create a comment without required fields', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedUserCommentLogin1);

      const { status, body } = await request(app.getHttpServer())
        .post(`/comments/${announcementId}`)
        .send({})
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(400);
      expect(body).toStrictEqual(mockedRequiredFieldsResponse);
    });

    it('Should be able create a comment with success', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedUserCommentLogin1);

      const { status, body } = await request(app.getHttpServer())
        .post(`/comments/${announcementId}`)
        .send(mockedCommentBody)
        .set('Authorization', `Bearer ${loginBody.token}`);

      commentId = body.id;

      expect(status).toBe(201);
      expect(body).toStrictEqual(mockedComment);
    });
  });

  describe('PATCH ---> /comments/:id', () => {
    it('Should not be able update without authorization token', async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch(`/comments/${commentId}`)
        .send(updateCommentBody);

      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should not be able update a comment with invalid comment', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedUserCommentLogin1);

      const { status, body } = await request(app.getHttpServer())
        .patch('/comments/1')
        .send(mockedCommentBody)
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(404);
      expect(body).toStrictEqual(mockedErrorResponse);
      expect(body.message).toBe('Comment not found');
    });

    it('Should not be able update a comment with not owner permissions', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedUserCommentLogin2);

      const { status, body } = await request(app.getHttpServer())
        .patch(`/comments/${commentId}`)
        .send(mockedCommentBody)
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(400);
      expect(body).toStrictEqual(mockedErrorResponse);
      expect(body.message).toBe('Comment does not belong to the user');
    });

    it('Should be able update a comment with success', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedUserCommentLogin1);

      const { status, body } = await request(app.getHttpServer())
        .patch(`/comments/${commentId}`)
        .send(updateCommentBody)
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(200);
      expect(body).toStrictEqual(mockedComment);
      expect(body.content).toBe(updateCommentBody.content);
    });
  });

  describe('Delete ---> /comments/:id', () => {
    it('Should not be able dalete without authorization token', async () => {
      const { status, body } = await request(app.getHttpServer()).delete(
        `/comments/${commentId}`,
      );

      expect(status).toBe(401);
      expect(body).toStrictEqual(mockedErrorResponse);
    });

    it('Should not be able delete a comment with invalid comment', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedUserCommentLogin1);

      const { status, body } = await request(app.getHttpServer())
        .delete('/comments/1')
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(404);
      expect(body).toStrictEqual(mockedErrorResponse);
      expect(body.message).toBe('Comment not found');
    });

    it('Should not be able delete a comment with not owner permissions', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedUserCommentLogin2);

      const { status, body } = await request(app.getHttpServer())
        .delete(`/comments/${commentId}`)
        .send(mockedCommentBody)
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(400);
      expect(body).toStrictEqual(mockedErrorResponse);
      expect(body.message).toBe('Comment does not belong to the user');
    });

    it('Should be able delete a comment with success', async () => {
      const { body: loginBody } = await request(app.getHttpServer())
        .post('/login')
        .send(mockedUserCommentLogin1);

      const { status } = await request(app.getHttpServer())
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${loginBody.token}`);

      expect(status).toBe(204);
    });
  });
});
