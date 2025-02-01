import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from '../list.controller';
import { ListService } from '../list.service';
import { CreateListItemDto } from '../dto/create-list-item.dto';

describe('ListController', () => {
  let controller: ListController;
  let mockListService: Partial<ListService>;

  beforeEach(async () => {
    mockListService = {
      addToList: jest.fn(),
      removeFromList: jest.fn(),
      listMyItems: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [
        {
          provide: ListService,
          useValue: mockListService,
        },
      ],
    }).compile();

    controller = module.get<ListController>(ListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToList', () => {
    it('should add item to list', async () => {
      const dto: CreateListItemDto = {
        itemId: 'movie123',
        type: 'movie',
        title: 'The Matrix',
      };
      const userId = 'user123';

      (mockListService.addToList as jest.Mock).mockResolvedValue({
        id: 'listItem123',
        userId,
        ...dto,
      });

      const result = await mockListService.addToList(userId, dto);
      expect(result).toBeDefined();
      expect(mockListService.addToList).toHaveBeenCalledWith(
        userId,
        dto.itemId,
        dto.type,
      );
    });
  });

  describe('removeFromList', () => {
    it('should remove item from list', async () => {
      const userId = 'user123';
      const itemId = 'movie123';

      (mockListService.removeFromList as jest.Mock).mockResolvedValue({
        success: true,
      });

      const result = await mockListService.removeFromList(userId, itemId);
      expect(result).toBeDefined();
      expect(mockListService.removeFromList).toHaveBeenCalledWith(
        userId,
        itemId,
      );
    });
  });

  describe('listMyItems', () => {
    it('should return user list', async () => {
      const userId = 'user123';
      const mockList = [
        { id: 'item1', userId, itemId: 'movie123', itemType: 'movie' },
        { id: 'item2', userId, itemId: 'show123', itemType: 'tvshow' },
      ];

      (mockListService.listMyItems as jest.Mock).mockResolvedValue({
        items: mockList,
        total: mockList.length,
        offset: 0,
        limit: 10,
      });

      const result = await mockListService.listMyItems(userId, {
        offset: 0,
        limit: 10,
      });
      expect(result).toEqual(mockList);
      expect(mockListService.listMyItems).toHaveBeenCalledWith(userId, {
        offset: 0,
        limit: 10,
      });
    });
  });
});
