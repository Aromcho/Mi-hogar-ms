import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { Property } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ClientProxy } from '@nestjs/microservices';
import { FilterPropertiesDto } from './dto/filter-properties.dto';

// Define the PaginateResult interface
interface PaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  offset: number;
}

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async createWithUser(user: any, dto: CreatePropertyDto) {
    if (!user || !user.id) {
      throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
    }

    try {
      const agentData = await this.userClient
        .send({ cmd: 'get_user_by_id' }, { id: user.id })
        .toPromise();

      if (!agentData) {
        throw new HttpException('Agente no encontrado', HttpStatus.NOT_FOUND);
      }

      const newProperty = await this.propertyModel.create({
        ...dto,
        agentId: new mongoose.Types.ObjectId(agentData._id),
        branchId: agentData.branchId ? new mongoose.Types.ObjectId(agentData.branchId) : null,
        realEstateAgency: agentData.realEstateAgency || 'Sin inmobiliaria',
      });

      return newProperty;
    } catch (error) {
      console.error('❌ Error al obtener datos del agente:', error?.message || error);
      throw new HttpException('Error al crear la propiedad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async search(dto: FilterPropertiesDto): Promise<PaginateResult<Property>> {
    const {
      operation_type, property_type, minRooms, maxRooms,
      minPrice, maxPrice, barrio, searchQuery, garages,
      limit = 10, offset = 0, order = 'DESC',
    } = dto;
  
    const filter: Record<string, any> = {};
  
    /* --- filtros --- */
    if (operation_type?.length) filter['operations.operation_type'] = { $in: operation_type };
    if (property_type?.length)  filter['type.name']                = { $in: property_type };
  
    if (minRooms !== undefined || maxRooms !== undefined) {
      filter.suite_amount = {};
      if (minRooms !== undefined) filter.suite_amount.$gte = minRooms;
      if (maxRooms !== undefined) filter.suite_amount.$lte = maxRooms;
    }
  
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter['operations.prices.price'] = {};
      if (minPrice !== undefined) filter['operations.prices.price'].$gte = minPrice;
      if (maxPrice !== undefined) filter['operations.prices.price'].$lte = maxPrice;
    }
  
    if (barrio) filter['location.name'] = { $regex: barrio, $options: 'i' };
  
    if (searchQuery) {
      filter.$or = [
        { address:               { $regex: searchQuery, $options: 'i' } },
        { 'location.full_location': { $regex: searchQuery, $options: 'i' } },
        { 'location.name':       { $regex: searchQuery, $options: 'i' } },
        { publication_title:     { $regex: searchQuery, $options: 'i' } },
        { real_address:          { $regex: searchQuery, $options: 'i' } },
      ];
    }
  
    if (garages && garages > 0) filter.parking_lot_amount = garages;
  
    /* --- paginación & orden --- */
    const limitNum  = +limit  || 10;
    const offsetNum = +offset || 0;
    const priceSort = (order ?? 'DESC').toLowerCase() === 'desc' ? -1 : 1;
  
    /* --- pipeline de agregación --- */
    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $facet: {
          docs: [
            { $sort: { 'operations.prices.price': priceSort } },
            { $skip: offsetNum },
            { $limit: limitNum },
            
          ],
          totalCount: [{ $count: 'value' }],
        },
      },
    ];
  
    const [facet] = await this.propertyModel.aggregate(pipeline).exec();
    const docs      = facet?.docs ?? [];
    const totalDocs = facet?.totalCount[0]?.value ?? 0;
  
    return { docs, totalDocs, limit: limitNum, offset: offsetNum };
  }
  
  async findAll() {
    return this.propertyModel
      .find()
      .populate('agentId', 'name email')
      .populate('branchId', 'name logo address')
      .exec();
  }

  async findByBranchId(branchId: string | number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const properties = await this.propertyModel
      .find({ 'branch.id': branchId })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.propertyModel.countDocuments({ 'branch.id': branchId });

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      data: properties,
    };
  }

  async findByAgentId(agentId: string) {
    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      throw new HttpException('ID de agente inválido', HttpStatus.BAD_REQUEST);
    }

    const properties = await this.propertyModel.find({ agentId }).exec();
    if (!properties.length) {
      throw new HttpException('No se encontraron propiedades para este agente', HttpStatus.NOT_FOUND);
    }

    return properties;
  }

  async findOne(id: string) {
    return this.propertyModel.findById(id).exec();
  }

  async update(id: string, dto: UpdatePropertyDto) {
    return this.propertyModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
  async updateWithUser(id: string, user: any, dto: UpdatePropertyDto) {
    const property = await this.propertyModel.findById(id);
  
    if (!property) {
      throw new HttpException('Propiedad no encontrada', HttpStatus.NOT_FOUND);
    }
  
    // 🔒 Validar que el usuario sea el creador
    if (property.agentId.toString() !== user.id) {
      throw new HttpException('No tienes permiso para editar esta propiedad', HttpStatus.FORBIDDEN);
    }
  
    const updated = await this.propertyModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    return updated;
  }  

  async delete(id: string) {
    return this.propertyModel.findByIdAndDelete(id).exec();
  }
  
  async deleteWithUser(id: string, user: any) {
    const property = await this.propertyModel.findById(id);
  
    if (!property) {
      throw new HttpException('Propiedad no encontrada', HttpStatus.NOT_FOUND);
    }
  
    if (property.agentId.toString() !== user.id) {
      throw new HttpException('No tienes permiso para eliminar esta propiedad', HttpStatus.FORBIDDEN);
    }
  
    await this.propertyModel.findByIdAndDelete(id);
    return { message: 'Propiedad eliminada correctamente' };
  }
  
}
