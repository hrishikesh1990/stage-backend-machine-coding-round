import { Controller, Put, Delete, Get, Body, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put(':userId/list')
    async addToList(@Param('userId') userId: string, @Body() item: { contentId: string; contentType: string }) {
        return this.userService.addToList(userId, item);
    }

    @Delete(':userId/list/:contentId')
    async removeFromList(@Param('userId') userId: string, @Param('contentId') contentId: string) {
        return this.userService.removeFromList(userId, contentId);
    }

    @Get(':userId/list')
    async listMyItems(@Param('userId') userId: string) {
        return this.userService.listMyItems(userId);
    }

    @Get(':userId')
    async listUser(@Param('userId') userId: string) {
        return this.userService.listUser(userId);
    }
}