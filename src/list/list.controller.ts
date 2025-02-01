import { Controller, Get, Param, UseGuards, Req, Post, Delete, BadRequestException } from '@nestjs/common';
import { ListService } from './list.service';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';

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
    async getMyList(@Req() request: Request) {
        const user = request.headers['x-user'] as string;
        const contentType = request.query.type as string;

        if (contentType && !['movies', 'tvshows'].includes(contentType)) {
            throw new BadRequestException('Invalid content type. Must be "movies" or "tvshows"');
        }

        return this.listService.listMyItems(user, contentType);
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