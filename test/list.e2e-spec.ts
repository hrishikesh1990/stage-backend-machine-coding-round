import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { SeedService } from '../src/seed/seed.service';

describe('ListController (e2e)', () => {
    let app: INestApplication;
    let dbConnection: Connection;
    let seedService: SeedService;
    let authHeader: string;
    let movieId: string;
    let tvshowId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dbConnection = moduleFixture.get<Connection>(getConnectionToken());
        seedService = moduleFixture.get<SeedService>(SeedService);

        await seedService.seedDatabase();

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

        it('should return empty list for new user', () => {
            return request(app.getHttpServer())
                .get('/list')
                .set('Authorization', authHeader)
                .expect(200)
                .expect(res => {
                    expect(res.body).toEqual([]);
                });
        });

        it('should filter by content type', () => {
            return request(app.getHttpServer())
                .get('/list?type=movies')
                .set('Authorization', authHeader)
                .expect(200)
                .expect(res => {
                    expect(res.body).toHaveLength(1);
                    expect(res.body[0]._id).toBe(movieId);
                });
        });

        it('should reject invalid content type', () => {
            return request(app.getHttpServer())
                .get('/list?type=invalid')
                .set('Authorization', authHeader)
                .expect(400);
        });
    });

    describe('POST /list', () => {
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
                            expect(res.body).toHaveLength(1);
                            expect(res.body[0]._id).toBe(movieId);
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
                            expect(res.body).toHaveLength(1);
                            expect(res.body[0]._id).toBe(tvshowId);
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
                            expect(res.body).toHaveLength(0);
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

        console.log({ movieId, tvshowId });
    }
});
