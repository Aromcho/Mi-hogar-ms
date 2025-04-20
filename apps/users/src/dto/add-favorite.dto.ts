import { IsMongoId } from 'class-validator';

export class AddFavoriteDto {
  @IsMongoId()
  propertyId: string;
}