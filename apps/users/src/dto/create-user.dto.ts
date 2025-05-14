import { IsEmail, IsNotEmpty, IsOptional,IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  logo?: string;

  @IsOptional()
  role?: string;

  @IsOptional()
  @IsString()
  photo?: string | null;

  @IsOptional()
  googleId?: string;
}
