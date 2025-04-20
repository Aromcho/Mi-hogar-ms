import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Request } from 'express';
import { AuthGuard } from './auth.guard'; // Ahora lo agregamos localmente
import { FilterPropertiesDto } from './dto/filter-properties.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreatePropertyDto) {
    return await this.propertiesService.createWithUser(req['user'], dto);
  }
  @Get('search')
  async search(@Query() query: FilterPropertiesDto) {
    const result = await this.propertiesService.search(query);
    return {
      meta: {
        limit: result.limit,
        offset: result.offset,
        total_count: result.totalDocs,
      },
      objects: result.docs,
    };
  }
  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get('by-branch/:id')
  findByBranchId(
    @Param('id') id: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.propertiesService.findByBranchId(id, page, limit);
  }

  @Get('by-agent/:agentId')
  findByAgentId(@Param('agentId') agentId: string) {
    return this.propertiesService.findByAgentId(agentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.updateWithUser(
      id,
      req['user'],
      updatePropertyDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.propertiesService.deleteWithUser(id, req['user']);
  }
}
