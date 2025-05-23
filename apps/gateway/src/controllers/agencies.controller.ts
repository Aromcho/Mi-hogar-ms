import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { MessagingService } from '../../../../libs/messaging/src/messaging.service';

@Controller('agencies')
export class AgenciesGatewayController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post()
  create(@Body() dto: any) {
    return this.messagingService.sendMessage(
      'agencies',
      { cmd: 'create_agency' },
      dto,
    );
  }

  @Get()
  findAll() {
    return this.messagingService.sendMessage(
      'agencies',
      { cmd: 'get_all_agencies' },
      {},
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagingService.sendMessage(
      'agencies',
      { cmd: 'get_agency_by_id' },
      id,
    );
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.messagingService.sendMessage(
      'agencies',
      { cmd: 'update_agency' },
      { id, dto },
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagingService.sendMessage(
      'agencies',
      { cmd: 'delete_agency' },
      id,
    );
  }
}
