import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '@src/common/dto/page-options.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetPermissionDto extends PageOptionsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    domain: string;
}
