import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  bathroom_amount?: number;

  // 🔥 Ya no los pide el cliente, los setea el backend
  @IsOptional()
  @IsString()
  agentId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  realEstateAgency?: string;
}
