import { Controller, Get, Query } from '@nestjs/common';
import { MessagingService } from '../../../../libs/messaging/src/messaging.service';

@Controller('autocomplete')
export class AutocompleteGatewayController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get()
  async search(@Query('query') query: string) {
    if (!query) throw new Error('Query es requerido');
    return this.messagingService.sendMessage('autocomplete', { cmd: 'autocomplete_search' }, { query});
  }
}
