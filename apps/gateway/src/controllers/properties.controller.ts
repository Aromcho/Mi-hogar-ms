import { Controller, Get, Param, Post, Body, Query, Put, Delete, Req } from '@nestjs/common';
import { MessagingService } from '../../../../libs/messaging/src/messaging.service';
import { Request } from 'express';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get()
  findAll() {
    return this.messagingService.sendMessage('properties', { cmd: 'get_all_properties' }, {});
  }

  @Get('/search')
  search(@Query() query: any) {
    const parsedQuery = {
      ...query,
      minRooms: query.minRooms ? Number(query.minRooms) : undefined,
      maxRooms: query.maxRooms ? Number(query.maxRooms) : undefined,
      minPrice: query.minPrice ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      minBathroom: query.minBathroom ? Number(query.minBathroom) : undefined,
      garages: query.garages ? Number(query.garages) : undefined,
      limit: query.limit ? Number(query.limit) : 20,
      offset: query.offset ? Number(query.offset) : 0,
      order: query.order || 'DESC',
    };

    return this.messagingService.sendMessage('properties', { cmd: 'search_properties' }, parsedQuery);
  }


  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.messagingService.sendMessage('properties',{ cmd: 'get_property_by_id' }, id);
  }

  @Get('/by-agent/:agentId')
  findByAgentId(@Param('agentId') agentId: string) {
    return this.messagingService.sendMessage('properties',{ cmd: 'get_properties_by_agent' }, agentId);
  }

  @Get('/by-branch/:id')
  findByBranchId(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.messagingService.sendMessage(
      'properties',
      { cmd: 'get_properties_by_branch' },
      { id, page: Number(page), limit: Number(limit) },
    );
  }

  @Post()
  create(@Req() req: Request, @Body() dto: any) {
    return this.messagingService.sendMessage(
      'properties',
      { cmd: 'create_property' },
      { user: req['user'], dto },
    );
  }


  @Put('/:id')
  update(@Param('id') id: string, @Req() req: Request, @Body() dto: any) {
    return this.messagingService.sendMessage(
      'properties',
      { cmd: 'update_property' },
      { id, user: req['user'], dto },
    );
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.messagingService.sendMessage(
      'properties',
      { cmd: 'delete_property' },
      { id, user: req['user'] },
    );
  }
}
