import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    description: string;

    @ApiPropertyOptional()
    @IsOptional()
    domain: string;
}
