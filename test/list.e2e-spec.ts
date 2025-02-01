import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { SeedService } from '../src/seed/seed.service';
import { SeedModule } from '../src/seed/seed.module';

describe('ListController (e2e)', () => {
    let app: INestApplication;
    let dbConnection: Connection;
    let seedService: SeedService;
    let authHeader: string;
    let movieId: string;
    let tvshowId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                //  SeedModule
                ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dbConnection = moduleFixture.get<Connection>(getConnectionToken());
        // seedService = moduleFixture.get<SeedService>(SeedService);

        // await seedService.seedDatabase();

        // mock auth header username and password are the same
        const testUser = 'user1';
        authHeader = 'Basic ' + Buffer.from(`${testUser}:${testUser}`).toString('base64');

        await setupTestData(dbConnection);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /list', () => {
        it('should require authentication', () => {
            return request(app.getHttpServer())
                .get('/list')
                .expect(401);
        });

        it('should return empty paginated list for new user', () => {
            return request(app.getHttpServer())
                .get('/list')
                .set('Authorization', authHeader)
                .expect(200)
                .expect(res => {
                    expect(res.body).toEqual({
                        items: [],
                        page: 1,
                        limit: 10,
                        total: 0,
                        totalPages: 0
                    });
                });
        });

        it('should handle pagination', async () => {
            // First add multiple items to the list
            await request(app.getHttpServer())
                .post('/list')
                .set('Authorization', authHeader)
                .send({
                    contentId: movieId,
                    contentType: 'Movie'
                });

            await request(app.getHttpServer())
                .post('/list')
                .set('Authorization', authHeader)
                .send({
                    contentId: tvshowId,
                    contentType: 'TVShow'
                });

            // Test first page with limit 1
            const response = await request(app.getHttpServer())
                .get('/list?page=1&limit=1')
                .set('Authorization', authHeader)
                .expect(200);

            expect(response.body).toMatchObject({
                items: expect.any(Array),
                page: 1,
                limit: 1,
                total: 2,
                totalPages: 2
            });
            expect(response.body.items).toHaveLength(1);

            // Test second page
            const secondPage = await request(app.getHttpServer())
                .get('/list?page=2&limit=1')
                .set('Authorization', authHeader)
                .expect(200);

            expect(secondPage.body).toMatchObject({
                items: expect.any(Array),
                page: 2,
                limit: 1,
                total: 2,
                totalPages: 2
            });
            expect(secondPage.body.items).toHaveLength(1);
            
            // Verify different items on different pages
            expect(secondPage.body.items[0].contentId).not.toBe(response.body.items[0].contentId);
        });
    });

    describe('POST /list', () => {

        beforeAll(async () => {
            await dbConnection.collection('users').updateOne({ username: 'user1' }, { $set: { myList: [] } });
        });

        it('should add movie to list', () => {
            return request(app.getHttpServer())
                .post('/list')
                .set('Authorization', authHeader)
                .send({
                    contentId: movieId,
                    contentType: 'Movie'
                })
                .expect(201)
                .then(() => {
                    return request(app.getHttpServer())
                        .get('/list')
                        .set('Authorization', authHeader)
                        .expect(200)
                        .expect(res => {
                            expect(res.body.items);
                            // one of the items should have contentId === movieID
                            expect(res.body.items.some(item => item.contentId === movieId)).toBe(true);
                        });
                });
        });

        it('should add tvshow to list', () => {
            return request(app.getHttpServer())
                .post('/list')
                .set('Authorization', authHeader)
                .send({
                    contentId: tvshowId,
                    contentType: 'TVShow'
                })
                .expect(201)
                .then(() => {
                    return request(app.getHttpServer())
                        .get('/list')
                        .set('Authorization', authHeader)
                        .expect(200)
                        .expect(res => {
                            expect(res.body.items);
                            expect(res.body.items.some(item => item.contentId === tvshowId)).toBe(true);
                        });

                });
        });

        it('should prevent duplicate content', () => {
            return request(app.getHttpServer())
                .post('/list')
                .set('Authorization', authHeader)
                .send({
                    contentId: movieId,
                    contentType: 'Movie'
                })
                .expect(400);
        });
    });

    describe('DELETE /list', () => {
        it('should remove content from list', () => {
            return request(app.getHttpServer())
                .delete('/list')
                .set('Authorization', authHeader)
                .send({
                    contentId: movieId
                })
                .expect(200)
                .then(() => {
                    return request(app.getHttpServer())
                        .get('/list')
                        .set('Authorization', authHeader)
                        .expect(200)
                        .expect(res => {
                            expect(res.body.items.some(item => item.contentId === movieId)).toBe(false);
                        });
                });
        });
    });


    async function setupTestData(dbConnection: Connection) {
        // Find the seeded movie and tvshow
        const movie = await dbConnection.collection('movies').findOne({ title: 'Interstellar' });
        if (!movie) {
            throw new Error('Seeded movie not found');
        }
        movieId = movie._id.toString();

        const tvshow = await dbConnection.collection('tvshows').findOne({ title: 'The Mandalorian' });
        if (!tvshow) {
            throw new Error('Seeded tvshow not found');
        }
        tvshowId = tvshow._id.toString();

        await dbConnection.collection('users').updateOne({ username: 'user1' }, { $set: { myList: [] } });

        console.log({ movieId, tvshowId });
    }
});
