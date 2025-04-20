import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10); 
    return this.userModel.create(createUserDto);
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: number) {
    return this.userModel.findOne({ id }).exec();
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ id }, updateUserDto, { new: true }).exec();
  }

  async delete(id: number) {
    return this.userModel.findOneAndDelete({ id }).exec();
  }
  async findOneByMongoId(id: string) {
    return this.userModel.findById(id).exec();
  }
  
  async updateByMongoId(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }
  
  async deleteByMongoId(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }



  async addFavorite(userId: string, propertyId: string) {
    // valida ObjectId
    if (!Types.ObjectId.isValid(propertyId)) {
      throw new Error('propertyId inválido');
    }
  
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: propertyId } },   // evita duplicados
      { new: true },
    );
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }
  
  async removeFavorite(userId: string, propertyId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: propertyId } },
      { new: true },
    );
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }
  
  async getFavorites(userId: string) {
    // trae los documentos de Property con populate lean()
    const user = await this.userModel
      .findById(userId)
      .populate({ path: 'favorites', model: 'Property' })
      .lean();
  
    if (!user) throw new Error('Usuario no encontrado');
    return user.favorites;
  }
}
