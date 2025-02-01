import { Controller, Put, Delete, Get, Body, Param, Query } from "@nestjs/common";
import { ApiTags, ApiQuery, ApiBody, ApiProperty } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { IsNotEmpty, IsString } from "class-validator";


@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put(':userId/mylist/:contentId')
    async addToList(@Param('userId') userId: string, @Param('contentId') contentId: string) {
        return this.userService.addToList(userId, contentId);
    }

    @Delete(':userId/mylist/:contentId')
    async removeFromList(@Param('userId') userId: string, @Param('contentId') contentId: string) {
        return this.userService.removeFromList(userId, contentId);
    }

    @Get(':userId/mylist')
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async listMyItems(@Param('userId') userId: string, @Query('limit') limit: number, @Query('offset') offset: number) {
        const validLimit = isNaN(limit) ? 10 : limit;
        const validOffset = isNaN(offset) ? 0 : offset;
        return this.userService.myListItems(userId, validLimit, validOffset);
    }

    @Get(':userId')
    async listUser(@Param('userId') userId: string) {
        return this.userService.listUser(userId);
    }

    @Get()
    async listAllUsers() {
        return this.userService.listAllUsers();
    }
}