import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class RolePermissionsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    roleId: string;

    @ApiProperty()
    @IsNotEmpty()
    permissionIds: string[];
}
