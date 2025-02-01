import { Controller, Get, Param, UseGuards, Req, Post, Delete, BadRequestException, Query } from '@nestjs/common';
import { ListService } from './list.service';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { PaginatedResponse } from './list.module';

@ApiTags('List')
@Controller('list')
export class ListController {
    constructor(private readonly listService: ListService) { }

    @Get()
    @ApiHeader({
        name: 'Authorization',
        description: 'Basic auth credentials',
        required: true,
    })
    async getMyList(
        @Req() request: Request,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ): Promise<PaginatedResponse> {
        const user = request.headers['x-user'] as string;
        
        const pageNumber = page ? parseInt(page as any) : 1;
        const limitNumber = limit ? parseInt(limit as any) : 10;

        if (pageNumber < 1) {
            throw new BadRequestException('Page must be greater than 0');
        }

        if (limitNumber < 1 || limitNumber > 100) {
            throw new BadRequestException('Limit must be between 1 and 100');
        }

        return this.listService.listMyItems(user, pageNumber, limitNumber);
    }

    @Post()
    @ApiHeader({
        name: 'Authorization',
        description: 'Basic auth credentials',
        required: true,
    })
    async addToMyList(@Req() request: Request) {
        const user = request.headers['x-user'] as string;
        return this.listService.addToList(user, request.body.contentId, request.body.contentType);
    }

    @Delete()
    @ApiHeader({
        name: 'Authorization',
        description: 'Basic auth credentials',
        required: true,
    })
    async removeFromMyList(@Req() request: Request) {
        const user = request.headers['x-user'] as string;
        return this.listService.removeFromList(user, request.body.contentId);
    }
} 