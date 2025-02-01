import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Query,
    Req,
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { UserService } from './user.service';
import {
    AddToListDto,
    RemoveFromListDto,
    ListQueryDto,
    PaginatedListResponseDto
} from './dto/list.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery
} from '@nestjs/swagger';

@ApiTags('User List')
@ApiBearerAuth()
@Controller('list')
export class ListController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get user\'s list items with pagination' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved list items',
        type: PaginatedListResponseDto
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User is not authenticated'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found'
    })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async getList(
        @Query() query: ListQueryDto,
        @Req() request
    ): Promise<PaginatedListResponseDto> {
        const { limit, offset } = query;
        return this.userService.listMyItems(request.user.id, limit, offset);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Add item to user\'s list' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Item successfully added to the list'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input or duplicate item'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User is not authenticated'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found'
    })
    async addToList(
        @Body() addToListDto: AddToListDto,
        @Req() request
    ) {
        return this.userService.addToList(request.user.id, addToListDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove item from user\'s list' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Item successfully removed from the list'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User is not authenticated'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User or item not found'
    })
    async removeFromList(
        @Body() removeFromListDto: RemoveFromListDto,
        @Req() request
    ) {
        return this.userService.removeFromList(
            request.user.id,
            removeFromListDto.contentId
        );
    }
}