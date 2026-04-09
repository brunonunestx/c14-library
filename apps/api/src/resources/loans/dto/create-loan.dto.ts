import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({ example: 'clx1abc123' })
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({ example: 'clx1def456' })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiPropertyOptional({ example: '2026-04-23T00:00:00.000Z', description: 'Prazo de devolução. Padrão: 14 dias a partir de hoje.' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
