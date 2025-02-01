import { Test, TestingModule } from '@nestjs/testing';
import { MyListService } from './my-list.service';
import { MyListSchema } from '../models/my-list.schema';
import { MovieSchema } from '../models/movie.schema';
import { TVShowSchema } from '../models/tvshow.schema';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

describe('MyListService', () => {
  let service: MyListService;
  let myListModel: any; // Mocked MyList model
  let movieModel: any; // Mocked Movie model
  let tvShowModel: any; // Mocked TVShow model

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyListService,
        {
          provide: getModelToken('MyList'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getModelToken('Movie'),
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: getModelToken('TVShow'),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MyListService>(MyListService);
    myListModel = module.get(getModelToken('MyList'));
    movieModel = module.get(getModelToken('Movie'));
    tvShowModel = module.get(getModelToken('TVShow'));
  });

  describe('addToMyList', () => {
    it("should add content to the user's list", async () => {
      const addToMyListDto = {
        username: 'testUser',
        contentId: '123',
        contentType: 'Movie' as 'Movie' | 'TVShow',
      };

      // Mocking the findOne and create methods
      myListModel.findOne = jest.fn().mockResolvedValue(null); // User not found in my list
      myListModel.create = jest.fn().mockResolvedValue({
        ...addToMyListDto,
        addedOn: new Date(),
      });

      const result = await service.addToMyList(addToMyListDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Content added successfully');
    });

    it('should throw error if content is already in the list', async () => {
      const addToMyListDto = {
        username: 'testUser',
        contentId: '123',
        contentType: 'Movie' as 'Movie' | 'TVShow',
      };

      // Mocking the findOne to simulate existing content in the list
      myListModel.findOne = jest.fn().mockResolvedValue({
        contentId: '123',
        contentType: 'Movie',
      });

      await expect(service.addToMyList(addToMyListDto)).rejects.toThrowError(
        'Content is already in your list',
      );
    });
  });

  describe('removeFromMyList', () => {
    it("should remove content from the user's list", async () => {
      const removeFromMyListDto = {
        username: 'testUser',
        contentId: '123',
        contentType: 'Movie' as 'Movie' | 'TVShow',
      };

      // Mocking the findOne and remove methods
      myListModel.findOne = jest.fn().mockResolvedValue({
        ...removeFromMyListDto,
        remove: jest.fn().mockResolvedValue(true),
      });

      const result = await service.removeFromMyList(removeFromMyListDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Content removed successfully');
    });

    it('should throw error if user or content not found', async () => {
      const removeFromMyListDto = {
        username: 'testUser',
        contentId: '123',
        contentType: 'Movie' as 'Movie' | 'TVShow',
      };

      // Mocking the findOne method to simulate user not found
      myListModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.removeFromMyList(removeFromMyListDto),
      ).rejects.toThrowError('Content not found in the list');
    });
  });

  describe('getMyList', () => {
    it("should get the user's list with populated content", async () => {
      const userId = 'testUser';
      const page = 1;
      const limit = 10;

      // Mocking the aggregation pipeline
      myListModel.aggregate = jest.fn().mockResolvedValue([
        {
          contentId: '123',
          contentType: 'Movie',
          addedOn: new Date(),
          contentDetails: {
            title: 'Movie Title',
            description: 'Movie Description',
          },
        },
      ]);

      const result = await service.getMyList(userId, page, limit);

      expect(result.success).toBe(true);
      expect(result.data.length).toBe(1);
      expect(result.data[0].contentDetails.title).toBe('Movie Title');
    });

    it('should return empty list if no content found', async () => {
      const userId = 'testUser';
      const page = 1;
      const limit = 10;

      // Mocking the aggregation pipeline to return empty list
      myListModel.aggregate = jest.fn().mockResolvedValue([]);

      const result = await service.getMyList(userId, page, limit);

      expect(result.success).toBe(true);
      expect(result.data.length).toBe(0);
    });
  });
});
