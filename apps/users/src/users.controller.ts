import { AddFavoriteDto } from './dto/add-favorite.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Post(':id/favorites')
  async addFavorite(@Param('id') userId: string, @Body() body: AddFavoriteDto) {
    return this.usersService.addFavorite(userId, body.propertyId);
  }

  // DELETE /users/:id/favorites/:propertyId
  @Delete(':id/favorites/:propertyId')
  async removeFavorite(
    @Param('id') userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    return this.usersService.removeFavorite(userId, propertyId);
  }

  // GET /users/:id/favorites
  @Get(':id/favorites')
  async getFavorites(@Param('id') userId: string) {
    return this.usersService.getFavorites(userId);
  }
}
