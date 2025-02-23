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

@Controller('users')
@UseGuards(ThrottlerGuard) 
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

  /** ✅ Get a user by ID */
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
      this.userService.testCache(); // ✅ Test cache
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

  /** ✅ Update user */
  @Put(':id')
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

  /** ✅ Delete user */
  @Delete(':id')
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
