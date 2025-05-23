import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AutocompleteService } from './autocomplete.service';

@Controller()
export class AutocompleteMessageController {
  private readonly logger = new Logger(AutocompleteMessageController.name);

  constructor(private readonly autocompleteService: AutocompleteService) {}

  @MessagePattern({ cmd: 'autocomplete_search' })
  async search(@Payload() data: { query: string }) {
    return this.autocompleteService.search(data.query);
  }
}
