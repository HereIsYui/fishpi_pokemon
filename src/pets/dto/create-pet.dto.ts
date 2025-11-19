import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { PetType } from '../schemas/pet.schema';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(PetType)
  type: PetType;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}