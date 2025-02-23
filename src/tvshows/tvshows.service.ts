import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TVShow, TVShowDocument } from '../models/tvshow.schema';
import { CreateTVshowDto } from './dto/create-tvshow.dto';
import { Cache } from 'cache-manager';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
@Injectable()
export class TVShowsService {
  constructor(
    @InjectModel(TVShow.name)
    private readonly tvShowModel: Model<TVShowDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, 
  ) {}

  async findAll(limit = 10, offset = 0): Promise<{ data: TVShow[]; total: number }> {
    try {
      const cacheKey = `tvshows_${limit}_${offset}`;
      const cachedData = await this.cacheManager.get(cacheKey);

      if (cachedData) {
        console.log('Cache Hit!'); 
        return cachedData as { data: TVShow[]; total: number };
      }

      console.log('Cache Miss. Fetching from DB...');
      const data = await this.tvShowModel.find().limit(limit).skip(offset).exec();
      const total = await this.tvShowModel.countDocuments().exec();

      const response = { data, total };
      await this.cacheManager.set(cacheKey, response, 600000); 

      return response;
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to retrieve TV Shows', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createTVShowDto: CreateTVshowDto): Promise<TVShow> {
    try {
      const createdTVShow = new this.tvShowModel(createTVShowDto);
      const savedTVShow = await createdTVShow.save();
    
      return savedTVShow;
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to create TV Show', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
