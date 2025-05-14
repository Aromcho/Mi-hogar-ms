import {
    IsOptional, IsInt, Min, IsString,
    IsIn, ArrayNotEmpty, ArrayUnique
  } from 'class-validator';
  import { Transform } from 'class-transformer';
  import { Type } from 'class-transformer';
  
  function csv<T = string | number>(value: string | string[]): T[] {
    if (Array.isArray(value)) return value as unknown as T[];
    return value.split(',').map(v => v.trim()) as unknown as T[];
  }
  
  export class FilterPropertiesDto {
    @IsOptional()
    @Transform(({ value }) => csv<string>(value))
    @ArrayNotEmpty()
    @ArrayUnique()
    operation_type?: string[];

    @IsOptional()
    @Transform(({ value }) => csv<string>(value))
    @ArrayNotEmpty()
    @ArrayUnique()
    property_type?: string[];

    @IsOptional()
    @IsInt()
    @Min(0)
    minRooms?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    maxRooms?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    minBathroom?: number;
    
    @IsOptional()
    @IsString()
    barrio?: string;

    @IsOptional()
    @IsString()
    searchQuery?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    garages?: number;

    @IsOptional()
    @Transform(
      ({ value }) => {
        if (Array.isArray(value)) value = value[0];
        const n = parseInt(value, 10);
        return isNaN(n) ? undefined : n;
      },
      { toClassOnly: true }, 
    )
    @IsInt()
    @Min(1)
    limit = 10;

    @IsOptional()
    @Transform(
      ({ value }) => {
        if (Array.isArray(value)) value = value[0];
        const n = parseInt(value, 10);
        return isNaN(n) ? undefined : n;
      },
      { toClassOnly: true },
    )
    @IsInt()
    @Min(0)
    offset = 0;

    @IsOptional()
    @IsIn(['ASC', 'DESC', 'asc', 'desc'])
    order: 'ASC' | 'DESC' = 'DESC';
  }
  