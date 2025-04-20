import {
    IsOptional,
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class UpdatePropertyDto {
    @IsOptional()
    @IsString()
    address?: string;
  
    @IsOptional()
    @IsNumber()
    bathroom_amount?: number;
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OperationDto)
    operations?: OperationDto[];
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PhotoDto)
    photos?: PhotoDto[];
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VideoDto)
    videos?: VideoDto[];
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TagDto)
    custom_tags?: TagDto[];
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExtraAttributeDto)
    extra_attributes?: ExtraAttributeDto[];
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileDto)
    files?: FileDto[];
  }
  
  // Sub-DTOs
  
  class OperationDto {
    @IsNumber()
    operation_id: number;
  
    @IsString()
    operation_type: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PriceDto)
    prices: PriceDto[];
  }
  
  class PriceDto {
    @IsString()
    currency: string;
  
    @IsString()
    period: string;
  
    @IsNumber()
    price: number;
  }
  
  class PhotoDto {
    @IsString()
    description: string;
  
    @IsString()
    image: string;
  
    @IsOptional()
    is_blueprint?: boolean;
  
    @IsOptional()
    is_front_cover?: boolean;
  
    @IsOptional()
    order?: number;
  
    @IsString()
    original: string;
  
    @IsString()
    thumb: string;
  }
  
  class VideoDto {
    @IsString()
    description: string;
  
    @IsNumber()
    id: number;
  
    @IsNumber()
    order: number;
  
    @IsString()
    player_url: string;
  
    @IsString()
    provider: string;
  
    @IsNumber()
    provider_id: number;
  
    @IsString()
    title: string;
  
    @IsString()
    url: string;
  
    @IsString()
    video_id: string;
  }
  
  class TagDto {
    @IsNumber()
    id: number;
  
    @IsString()
    name: string;
  
    @IsNumber()
    type: number;
  }
  
  class ExtraAttributeDto {
    @IsOptional()
    is_expenditure: boolean;
  
    @IsOptional()
    is_measure: boolean;
  
    @IsString()
    name: string;
  
    @IsString()
    value: string;
  }
  
  class FileDto {
    @IsString()
    file: string;
  }
  