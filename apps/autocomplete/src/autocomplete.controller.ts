import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { AutocompleteService } from './autocomplete.service';

@Controller('autocomplete')
export class AutocompleteController {
  constructor(private readonly autocompleteService: AutocompleteService) {}

  @Get()
  async getAutocomplete(@Query('query') query: string) {
    if (!query) {
      throw new BadRequestException('Query es requerido');
    }

    return this.autocompleteService.search(query);
  }
}
