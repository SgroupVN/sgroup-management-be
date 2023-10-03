import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '@src/common/dto/page-options.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetRoleDto extends PageOptionsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name: string;
}
