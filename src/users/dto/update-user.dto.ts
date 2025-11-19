import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

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
  coins?: number;
}