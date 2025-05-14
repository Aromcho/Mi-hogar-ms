import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Branch } from './branch.schema';

export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  USER = 'user',
}

@Schema()
export class User extends Document {
  @Prop()
  address: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  logo: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop()
  role: UserRole;

  @Prop()
  photo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: false })
  branchId?: string; // 🔹 Relación con la sucursal
  
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Property', default: [] })
  favorites: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
