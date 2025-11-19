import { IsString, IsOptional, IsEnum, IsNumber, Min, Max, IsBoolean, IsDate } from 'class-validator';
import { PetStatus, PetType } from '../schemas/pet.schema';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PetType)
  type?: PetType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  level?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  health?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  hunger?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  happiness?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  energy?: number;

  @IsOptional()
  @IsEnum(PetStatus)
  status?: PetStatus;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  battlesWon?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  battlesLost?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsDate()
  lastFed?: Date;

  @IsOptional()
  @IsDate()
  lastPlayed?: Date;

  @IsOptional()
  @IsDate()
  lastSlept?: Date;
}