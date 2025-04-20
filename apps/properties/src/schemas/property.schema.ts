import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
class Operation {
  @Prop({ type: Number, index: true })
  operation_id: number;

  @Prop({ type: String, index: true })
  operation_type: string;

  @Prop({ type: [{ currency: String, period: String, price: Number }] })
  prices: { currency: string; period: string; price: number }[];
}

@Schema()
class Photo {
  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  is_blueprint: boolean;

  @Prop()
  is_front_cover: boolean;

  @Prop()
  order: number;

  @Prop()
  original: string;

  @Prop()
  thumb: string;
}

@Schema()
class Tag {
  @Prop()
  id: number;

  @Prop({ type: String, index: true })
  name: string;

  @Prop()
  type: number;
}

@Schema()
class Video {
  @Prop()
  description: string;

  @Prop()
  id: number;

  @Prop()
  order: number;

  @Prop()
  player_url: string;

  @Prop()
  provider: string;

  @Prop()
  provider_id: number;

  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  video_id: string;
}
@Schema()
class Division {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  resource_uri: string;
}

export const DivisionSchema = SchemaFactory.createForClass(Division);
@Schema()
class Location {
  @Prop({ type: [DivisionSchema], index: true })
divisions: Division[];

  @Prop({ type: String, text: true })
  full_location: string;

  @Prop({ type: String, index: true })
  name: string;

  @Prop()
  parent_division: string;

  @Prop()
  short_location: string;

  @Prop()
  state: string;

  @Prop()
  weight: number;
}


@Schema()
class Producer {
  @Prop()
  cellphone: string;

  @Prop()
  email: string;

  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  picture: string;

  @Prop()
  position: string;
}

export const ProducerSchema = SchemaFactory.createForClass(Producer);

@Schema()
class PropertyType {
  @Prop()
  code: string;

  @Prop()
  id: number;

  @Prop({ type: String, index: true })
  name: string;
}

export const PropertyTypeSchema = SchemaFactory.createForClass(PropertyType);
@Schema()
class ExtraAttribute {
  @Prop()
  is_expenditure: boolean;

  @Prop()
  is_measure: boolean;

  @Prop()
  name: string;

  @Prop()
  value: string;
}

export const ExtraAttributeSchema = SchemaFactory.createForClass(ExtraAttribute);

@Schema()
class File {
  @Prop()
  file: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
@Schema({ collection: 'propiedades', timestamps: true })
export class Property extends Document {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ type: String, text: true })
  address: string;

  @Prop({ type: Number, index: true })
  age: number;

  @Prop({ type: Number, index: true })
  bathroom_amount: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  agentId: string; // Agente que publicó la propiedad

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Branch',
    required: false,
    index: true,
  })
  branchId?: string; // Inmobiliaria a la que pertenece (opcional)

  @Prop()
  created_at: Date;

  @Prop()
  custom1: string;

  @Prop({ type: [Tag] })
  custom_tags: Tag[];

  @Prop()
  deleted_at: Date;

  @Prop()
  depth_measure: string;

  @Prop({ type: String, text: true })
  description: string;

  @Prop()
  description_only: string;

  @Prop({ type: MongooseSchema.Types.Mixed }) // ✅ Ahora MongoDB acepta cualquier tipo
  development: Record<string, any>;

  @Prop()
  development_excel_extra_data: string;

  @Prop()
  disposition: string;

  @Prop()
  expenses: number;

  @Prop({ type: [ExtraAttributeSchema] })
  extra_attributes: ExtraAttribute[];

  @Prop()
  fake_address: string;

  @Prop({ type: [FileSchema] })
  files: File[];

  @Prop()
  floors_amount: number;

  @Prop()
  footer: string;

  @Prop()
  front_measure: string;

  @Prop({ type: Number, index: true })
  geo_lat: number;

  @Prop({ type: Number, index: true })
  geo_long: number;

  @Prop()
  gm_location_type: string;

  @Prop()
  has_temporary_rent: boolean;

  @Prop()
  is_denounced: boolean;

  @Prop()
  is_starred_on_web: boolean;

  @Prop()
  legally_checked: string;

  @Prop({ type: Location })
  location: Location;

  @Prop({ type: [Object] })
  occupation: object[];

  @Prop({ type: [Operation] })
  operations: Operation[];

  @Prop()
  orientation: string;

  @Prop({ type: Number, index: true })
  parking_lot_amount: number;

  @Prop({ type: [Photo] })
  photos: Photo[];

  @Prop({ type: ProducerSchema })
  producer: Producer;

  @Prop({ type: String, text: true })
  property_condition: string;

  @Prop()
  public_url: string;

  @Prop({ type: String, text: true })
  publication_title: string;

  @Prop({ type: String, text: true })
  real_address: string;

  @Prop()
  reference_code: string;

  @Prop()
  rich_description: string;

  @Prop()
  roofed_surface: string;

  @Prop({ type: Number, index: true })
  room_amount: number;

  @Prop()
  semiroofed_surface: string;

  @Prop()
  situation: string;

  @Prop()
  status: number;

  @Prop({ type: Number, index: true })
  suite_amount: number;

  @Prop()
  surface: string;

  @Prop()
  surface_measurement: string;

  @Prop({ type: [Tag] })
  tags: Tag[];

  @Prop()
  toilet_amount: number;

  @Prop({ type: String, index: true })
  total_surface: string;

  @Prop()
  transaction_requirements: string;

  @Prop({ type: PropertyTypeSchema }) // ✅ Ahora usa un subesquema
  type: PropertyType;

  @Prop()
  unroofed_surface: string;

  @Prop({ type: [Video] })
  videos: Video[];

  @Prop()
  web_price: boolean;

  @Prop()
  zonification: string;

  @Prop({ required: true })
  realEstateAgency: string; // Diferenciar inmobiliarias (Belga o Silvia)
}

export const PropertySchema = SchemaFactory.createForClass(Property);
