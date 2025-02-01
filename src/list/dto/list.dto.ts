import {
    IsEnum,
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    Min,
    Max
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddToListDto {
    @ApiProperty({
        description: 'ID of the content (movie or TV show) to be added to the list',
        example: '507f1f77bcf86cd799439011'
    })
    @IsNotEmpty()
    @IsString()
    contentId: string;

    @ApiProperty({
        description: 'Type of content being added',
        enum: ['Movie', 'TVShow'],
        example: 'Movie'
    })
    @IsNotEmpty()
    @IsEnum(['Movie', 'TVShow'])
    contentType: 'Movie' | 'TVShow';
}

export class RemoveFromListDto {
    @ApiProperty({
        description: 'ID of the content to be removed from the list',
        example: '507f1f77bcf86cd799439011'
    })
    @IsNotEmpty()
    @IsString()
    contentId: string;
}

export class ListQueryDto {
    @ApiProperty({
        description: 'Number of items to return',
        minimum: 1,
        maximum: 50,
        default: 10,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(50)
    limit: number = 10;

    @ApiProperty({
        description: 'Number of items to skip',
        minimum: 0,
        default: 0,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    offset: number = 0;
}

export class ListItemResponseDto {
    @ApiProperty({
        description: 'ID of the content',
        example: '507f1f77bcf86cd799439011'
    })
    contentId: string;

    @ApiProperty({
        description: 'Type of content',
        enum: ['Movie', 'TVShow'],
        example: 'Movie'
    })
    contentType: string;
}

export class PaginatedListResponseDto {
    @ApiProperty({ type: [ListItemResponseDto] })
    items: ListItemResponseDto[];

    @ApiProperty({
        description: 'Pagination information',
        type: 'object',
        properties: {
            total: {
                type: 'number',
                description: 'Total number of items',
                example: 100
            },
            limit: {
                type: 'number',
                description: 'Number of items per page',
                example: 10
            },
            offset: {
                type: 'number',
                description: 'Number of items skipped',
                example: 0
            },
            hasMore: {
                type: 'boolean',
                description: 'Whether there are more items',
                example: true
            }
        }
    })
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}