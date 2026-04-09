import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsISBN, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Code' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Robert C. Martin' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: '9780132350884' })
  @IsISBN()
  isbn: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
