import { AddFavoriteDto } from './dto/add-favorite.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user', error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users', error.message);
    }
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    try {
      return await this.usersService.findOneByEmail(email);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by email', error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user', error.message);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Error updating user', error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.usersService.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user', error.message);
    }
  }

  @Post(':id/favorites')
  async addFavorite(@Param('id') userId: string, @Body() body: AddFavoriteDto) {
    try {
      return await this.usersService.addFavorite(userId, body.propertyId);
    } catch (error) {
      throw new InternalServerErrorException('Error adding favorite', error.message);
    }
  }

  @Delete(':id/favorites/:propertyId')
  async removeFavorite(@Param('id') userId: string, @Param('propertyId') propertyId: string) {
    try {
      return await this.usersService.removeFavorite(userId, propertyId);
    } catch (error) {
      throw new InternalServerErrorException('Error removing favorite', error.message);
    }
  }

  @Get(':id/favorites')
  async getFavorites(@Param('id') userId: string) {
    try {
      return await this.usersService.getFavorites(userId);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching favorites', error.message);
    }
  }
}
