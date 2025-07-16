import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string;
}