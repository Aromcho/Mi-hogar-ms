import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersMessageController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'get_all_users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'get_user_by_email' })
  async findOneByEmail(@Payload() data: { email: string }) {
    return this.usersService.findOneByEmail(data.email);
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async findOneByMongoId(@Payload() data: { id: string }) {
    return this.usersService.findOneByMongoId(data.id);
  }

  @MessagePattern({ cmd: 'create_user' })
  async create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'update_user' })
  async update(@Payload() data: { id: string } & UpdateUserDto) {
    const { id, ...dto } = data;
    return this.usersService.updateByMongoId(id, dto);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async delete(@Payload() data: { id: string }) {
    return this.usersService.deleteByMongoId(data.id);
  }

  @MessagePattern({ cmd: 'find_or_create_google' })
async handleGoogleUser(@Payload() data: { googleId: string; email: string; name: string }) {
  const user = await this.usersService.findOneByEmail(data.email); // <- corregido
  if (user) return user;

  return await this.usersService.create({
    email: data.email,
    name: data.name,
    googleId: data.googleId,
    password: data.googleId, // podés hashearlo si querés
  });
}


}
