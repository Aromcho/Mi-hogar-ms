import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Branch extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  logo: string;

  @Prop()
  address: string;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
