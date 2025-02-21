import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { ListService } from '../list/list.service';

describe('List API (e2e)', () => {
  let app: INestApplication;
  let listService = { 
    addToList: jest.fn(),
    bulkAddToList: jest.fn(),
    listMyItems: jest.fn(),
    removeFromList: jest.fn()
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ListService)
      .useValue(listService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const userId = '12345';

  it('✅ Should add an item to My List', async () => {
    const mockItem = { contentId: 'xyz123', contentType: 'Movie' };
    listService.addToList.mockResolvedValue({
      message: 'Item added successfully',
      myList: [mockItem],
    });

    return request(app.getHttpServer())
      .post(`/list/${userId}`)
      .send(mockItem)
      .expect(201)
      .expect({
        message: 'Item added successfully',
        myList: [mockItem],
      });
  });

  it('✅ Should bulk add items to My List', async () => {
    const mockItems = [
      { contentId: 'abc456', contentType: 'TV Show' },
      { contentId: 'def789', contentType: 'Movie' },
    ];
    
    listService.bulkAddToList.mockResolvedValue({
      message: 'Items added successfully',
      myList: mockItems,
    });

    return request(app.getHttpServer())
      .post(`/list/bulk/${userId}`)
      .send(mockItems)
      .expect(201)
      .expect({
        message: 'Items added successfully',
        myList: mockItems,
      });
  });

  it('✅ Should retrieve My List with pagination', async () => {
    const mockList = [
      { contentId: 'xyz123', contentType: 'Movie' },
      { contentId: 'abc456', contentType: 'TV Show' },
    ];

    listService.listMyItems.mockResolvedValue({
      items: mockList,
      total: 2,
      limit: 10,
      offset: 0,
    });

    return request(app.getHttpServer())
      .get(`/list/${userId}?limit=10&offset=0`)
      .expect(200)
      .expect({
        items: mockList,
        total: 2,
        limit: 10,
        offset: 0,
      });
  });

  it('✅ Should retrieve filtered My List by contentType', async () => {
    const mockFilteredList = [{ contentId: 'xyz123', contentType: 'Movie' }];
    
    listService.listMyItems.mockResolvedValue({
      items: mockFilteredList,
      total: 1,
      limit: 10,
      offset: 0,
    });

    return request(app.getHttpServer())
      .get(`/list/${userId}?contentType=Movie`)
      .expect(200)
      .expect({
        items: mockFilteredList,
        total: 1,
        limit: 10,
        offset: 0,
      });
  });

  it('✅ Should remove an item from My List', async () => {
    listService.removeFromList.mockResolvedValue({
      message: 'Item removed successfully',
    });

    return request(app.getHttpServer())
      .delete(`/list/${userId}/xyz123`)
      .expect(200)
      .expect({
        message: 'Item removed successfully',
      });
  });
});
