import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DevelopmentsService } from './developments.service';
import { CreateDevelopmentDto } from './dto/create-development.dto';
import { UpdateDevelopmentDto } from './dto/update-development.dto';

@Controller('developments')
export class DevelopmentsController {
  constructor(private readonly developmentsService: DevelopmentsService) {}

  @Post()
  create(@Body() createDevelopmentDto: CreateDevelopmentDto) {
    return this.developmentsService.create(createDevelopmentDto);
  }

  @Get()
  findAll() {
    return this.developmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.developmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevelopmentDto: UpdateDevelopmentDto) {
    return this.developmentsService.update(+id, updateDevelopmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.developmentsService.remove(+id);
  }
}
