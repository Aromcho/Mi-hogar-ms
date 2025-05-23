import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Agency extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  slug: string; // Para URL amigables, ej: "silvia-fernandez"

  @Prop()
  logo: string; // URL al logo

  @Prop()
  coverImage: string; // Portada o imagen de fondo

  @Prop()
  description: string; // Descripción larga institucional

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop()
  foundedYear: number;

  @Prop()
  teamDescription: string; // Descripción breve del equipo

  @Prop({
    type: [
      {
        platform: String, 
        url: String, 
      },
    ],
    default: [],
  })
  socialLinks: { platform: string; url: string }[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  agents: string[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Property', default: [] })
  properties: string[];

  @Prop({ default: false })
  isFeatured: boolean; // Para destacar en el home u ordenarlo arriba
}

export const AgencySchema = SchemaFactory.createForClass(Agency);
