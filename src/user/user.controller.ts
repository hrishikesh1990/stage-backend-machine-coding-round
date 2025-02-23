import { 
    Controller, 
    Get, 
    Post, 
    Put,
    Delete,
    Body, 
    Param, 
    HttpException, 
    HttpStatus,
    UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiTags('Users') 
@Controller('users')
@UseGuards(ThrottlerGuard) 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
 
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

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
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
      this.userService.testCache(); 
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

  @Put(':id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.updateUser(id, updateUserDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  
  async deleteUser(@Param('id') id: string) {
    try {
      const response = await this.userService.deleteUser(id);
      return {
        statusCode: HttpStatus.OK,
        message: response.message,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' },
        HttpStatus.NOT_FOUND
      );
    }
  }
}
