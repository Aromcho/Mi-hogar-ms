import { IsString, IsOptional, IsArray, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { SocialPlatform } from './social-platform.enum';

class SocialLink {
  @IsString()
  platform: string;

  @IsString()
  url: string;
}

export class CreateAgencyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsNumber()
  foundedYear?: number;

  @IsOptional()
  @IsString()
  teamDescription?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLink)
  socialLinks?: SocialLink[];

  @IsOptional()
  @IsArray()
  agents?: string[];

  @IsOptional()
  @IsArray()
  properties?: string[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
