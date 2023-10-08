import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { IsOptional } from 'class-validator';

export class UsersPageOptionsDto extends PageOptionsDto {
    @ApiPropertyOptional()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    major?: string;

    @ApiPropertyOptional()
    @IsOptional()
    phone?: string;
}
