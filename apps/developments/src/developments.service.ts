import { Injectable } from '@nestjs/common';
import { CreateDevelopmentDto } from './dto/create-development.dto';
import { UpdateDevelopmentDto } from './dto/update-development.dto';

@Injectable()
export class DevelopmentsService {
  create(createDevelopmentDto: CreateDevelopmentDto) {
    return 'This action adds a new development';
  }

  findAll() {
    return `This action returns all developments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} development`;
  }

  update(id: number, updateDevelopmentDto: UpdateDevelopmentDto) {
    return `This action updates a #${id} development`;
  }

  remove(id: number) {
    return `This action removes a #${id} development`;
  }
}
