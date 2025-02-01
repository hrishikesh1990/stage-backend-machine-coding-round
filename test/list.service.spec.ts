import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../list/list.service';
import { getModelToken } from '@nestjs/mongoose';
import { List } from '../models/list.schema';

describe('UserService', () => {
  let userService: UserService;
  let mockListModel: any;

  beforeEach(async () => {
    mockListModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      deleteOne: jest.fn(),
      save: jest.fn(),
      exec: jest.fn(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(List.name),
          useValue: mockListModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('addToList', () => {
    it('should add an item to the list', async () => {
      const userId = 'user123';
      const addToListDto = { contentId: 'movie123', contentType: 'Movie' };

      mockListModel.findOne.mockResolvedValue(null);
      mockListModel.mockReturnValue({
        save: jest.fn().mockResolvedValue(addToListDto),
      });

      const result = await userService.addToList(userId, addToListDto);
      expect(result).toEqual(addToListDto);
      expect(mockListModel.findOne).toHaveBeenCalledWith({
        contentId: addToListDto.contentId,
        contentType: addToListDto.contentType,
        userId,
      });
    });

    it('should throw an error if the item already exists', async () => {
      const userId = 'user123';
      const addToListDto = { contentId: 'movie123', contentType: 'Movie' };

      mockListModel.findOne.mockResolvedValue(addToListDto);

      await expect(userService.addToList(userId, addToListDto)).rejects.toThrow(
        'Item already in the list',
      );
    });
  });

  describe('removeFromList', () => {
    it('should remove an item from the list', async () => {
      const userId = 'user123';
      const contentId = 'movie123';

      mockListModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await userService.removeFromList(userId, contentId);
      expect(result).toEqual({ message: 'Item removed successfully' });
      expect(mockListModel.deleteOne).toHaveBeenCalledWith({
        contentId,
        userId,
      });
    });

    it('should throw an error if the item does not exist', async () => {
      const userId = 'user123';
      const contentId = 'movie123';

      mockListModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(
        userService.removeFromList(userId, contentId),
      ).rejects.toThrow('Item not found in the list');
    });
  });

  describe('listMyItems', () => {
    it('should return a list of items', async () => {
      const userId = 'user123';
      const limit = 10;
      const offset = 0;
      const mockItems = [{ contentId: 'movie123', contentType: 'Movie' }];

      mockListModel.find.mockReturnValue(mockItems);
      mockListModel.exec.mockResolvedValue(mockItems);

      const result = await userService.listMyItems(userId, limit, offset);
      expect(result).toEqual(mockItems);
      expect(mockListModel.find).toHaveBeenCalledWith({ userId });
    });

    it('should return a filtered list of items by content type', async () => {
      const userId = 'user123';
      const limit = 10;
      const offset = 0;
      const contentType = 'Movie';
      const mockItems = [{ contentId: 'movie123', contentType: 'Movie' }];

      mockListModel.find.mockReturnValue(mockItems);
      mockListModel.exec.mockResolvedValue(mockItems);

      const result = await userService.listMyItems(
        userId,
        limit,
        offset,
        contentType,
      );
      expect(result).toEqual(mockItems);
      expect(mockListModel.find).toHaveBeenCalledWith({ userId, contentType });
    });
  });
});
