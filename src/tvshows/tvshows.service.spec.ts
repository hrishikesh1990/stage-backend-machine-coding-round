import { Test, TestingModule } from '@nestjs/testing';
import { TVShowsService } from './tvshows.service';
import { getModelToken } from '@nestjs/mongoose';
import { TVShow } from '../models/tvshow.schema';
import { Model } from 'mongoose';

describe('TVShowsService', () => {
  let service: TVShowsService;
  let model: Model<TVShow>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TVShowsService,
        {
          provide: getModelToken(TVShow.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TVShowsService>(TVShowsService);
    model = module.get<Model<TVShow>>(getModelToken(TVShow.name));
  });

  it('should return all TV shows', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue([{ title: 'Breaking Bad', description: 'Crime Drama' }]),
    } as any);

    expect(await service.findAll()).toEqual([{ title: 'Breaking Bad', description: 'Crime Drama' }]);
  });
});
