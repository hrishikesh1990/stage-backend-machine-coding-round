import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ListModule } from '../list.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('ListController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGODB_URI_TEST),
        ListModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/list (POST)', () => {
    it('should add item to list', () => {
      return request(app.getHttpServer())
        .post('/list')
        .set('userId', 'testUser123')
        .send({
          itemId: 'movie123',
          itemType: 'movie',
        })
        .expect(201);
    });

    it('should fail when adding duplicate item', async () => {
      // First add
      await request(app.getHttpServer())
        .post('/list')
        .set('userId', 'testUser123')
        .send({
          itemId: 'movie456',
          itemType: 'movie',
        });

      // Try to add again
      return request(app.getHttpServer())
        .post('/list')
        .set('userId', 'testUser123')
        .send({
          itemId: 'movie456',
          itemType: 'movie',
        })
        .expect(400);
    });
  });

  describe('/list/:itemId (DELETE)', () => {
    it('should remove item from list', async () => {
      // First add an item
      const addResponse = await request(app.getHttpServer())
        .post('/list')
        .set('userId', 'testUser123')
        .send({
          itemId: 'movieToDelete',
          itemType: 'movie',
        });

      // Then delete it
      return request(app.getHttpServer())
        .delete(`/list/movieToDelete`)
        .set('userId', 'testUser123')
        .expect(200);
    });
  });

  describe('/list (GET)', () => {
    it('should return user list', async () => {
      const response = await request(app.getHttpServer())
        .get('/list')
        .set('userId', 'testUser123')
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
});
