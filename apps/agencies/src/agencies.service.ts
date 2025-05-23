import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { Agency } from './schemas/agencies.schema';
import { InjectModel } from '@nestjs/mongoose';
import { promises } from 'dns';

@Injectable()
export class AgenciesService {
  constructor(
     @InjectModel(Agency.name) private agencyModel: Model<Agency>,
  ) {}

  async create(dto: CreateAgencyDto): Promise<Agency> {
    const create = new this.agencyModel(dto);
    return create.save();
  }

  async findAll(): Promise<Agency[]> {
    return this.agencyModel.find().sort({ isFeatured: -1, name: 1 }).exec();
   }

  async findOne(id: string): Promise<Agency> {
    const agency = await this.agencyModel.findById(id).exec();
    if (!agency) {
      throw new Error(`Agency with id ${id} not found`);
    }
    return agency;    
  }

  async update(id: string, dto: UpdateAgencyDto): Promise<Agency> {
    const updated = await this.agencyModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updated) {
      throw new Error(`Agency with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string) {
   const result = await this.agencyModel.findByIdAndDelete(id).exec();
   if (!result) {
      throw new Error(`Agency with id ${id} not found`);
    }
    return result;
  }
}
