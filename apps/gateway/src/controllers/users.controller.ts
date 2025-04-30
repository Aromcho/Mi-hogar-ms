import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { MessagingService } from '../../../../libs/messaging/src/messaging.service';

@Controller('users')
export class UsersController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get()
  async findAll() {
    return this.messagingService.sendMessage('users',{ cmd: 'get_all_users' }, {});
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.messagingService.sendMessage('users',{ cmd: 'get_user_by_email' }, { email });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.messagingService.sendMessage('users',{ cmd: 'get_user_by_id' }, { id });
  }

  @Post()
  async create(@Body() body: any) {
    return this.messagingService.sendMessage('users',{ cmd: 'create_user' }, body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.messagingService.sendMessage('users',{ cmd: 'update_user' }, { id, ...body });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.messagingService.sendMessage('users',{ cmd: 'delete_user' }, { id });
  }
}
