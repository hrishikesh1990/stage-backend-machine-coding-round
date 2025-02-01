import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from '../list.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ListItem } from '../schemas/list-item.schema';

describe('ListService', () => {
  let mockListItemModel: any;
  let service: ListService;

  beforeEach(async () => {
    mockListItemModel = {
      addToList: jest.fn(),
      removeFromList: jest.fn(),
      listMyItems: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: getModelToken(ListItem.name),
          useValue: mockListItemModel,
        },
      ],
    }).compile();

    service = module.get<ListService>(ListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToList', () => {
    it('should add a movie to list successfully', async () => {
      const userId = 'user123';
      const itemId = 'movie123';
      const itemType = 'movie';

      jest.spyOn(mockListItemModel, 'addToList').mockResolvedValue({
        userId,
        itemId,
        type: itemType,
        title: 'Test Movie',
        description: 'Test Description',
      } as ListItem);

      const result = await service.addToList(userId, {
        itemId,
        type: itemType,
        title: 'Test Movie',
        description: 'Test Description',
      });
      expect(result).toBeDefined();
      expect(mockListItemModel.addToList).toHaveBeenCalled();
    });

    it('should throw BadRequestException if item already exists in list', async () => {
      mockListItemModel.findOne.mockResolvedValue({ id: 'existing' });

      await expect(
        service.addToList('user123', {
          itemId: 'movie123',
          type: 'movie',
          title: 'Test Movie',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeFromList', () => {
    it('should remove item from list successfully', async () => {
      mockListItemModel.findOneAndDelete.mockResolvedValue({
        id: 'item123',
      });

      const result = await service.removeFromList('user123', 'movie123');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if item not found', async () => {
      mockListItemModel.findOneAndDelete.mockResolvedValue(null);

      await expect(
        service.removeFromList('user123', 'movie123'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('listMyItems', () => {
    it('should return user list items', async () => {
      const mockItems = [
        { userId: 'user123', itemId: 'movie123', itemType: 'movie' },
        { userId: 'user123', itemId: 'show123', itemType: 'tvshow' },
      ];

      mockListItemModel.find.mockResolvedValue(mockItems);

      const result = await service.listMyItems('user123', {
        offset: 0,
        limit: 10,
      });
      expect(result).toEqual(mockItems);
      expect(mockListItemModel.find).toHaveBeenCalledWith({
        userId: 'user123',
      });
    });
  });
});
