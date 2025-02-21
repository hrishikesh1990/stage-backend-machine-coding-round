import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    HttpException, 
    HttpStatus 
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
      try {
        const user = await this.userService.createUser(createUserDto);
        return {
          statusCode: HttpStatus.CREATED,
          message: 'User created successfully',
          data: user,
        };
      } catch (error) {
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
          HttpStatus.BAD_REQUEST
        );
      }
    }
    @Get(':id')
    async getUserById(@Param('id') id: string) {
      try {
        const user = await this.userService.getUserById(id);
        return {
          statusCode: HttpStatus.OK,
          message: 'User retrieved successfully',
          data: user,
        };
      } catch (error) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' },
          HttpStatus.NOT_FOUND
        );
      }
    }
    @Get()
    async getAllUsers() {
      try {
        const users = await this.userService.getAllUsers();
        return {
          statusCode: HttpStatus.OK,
          message: 'Users retrieved successfully',
          data: users,
        };
      } catch (error) {
        throw new HttpException(
          { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to retrieve users' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
  