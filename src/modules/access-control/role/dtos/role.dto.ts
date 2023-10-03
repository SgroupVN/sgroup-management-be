import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../../common/dto/abstract.dto';
import type { PermissionDto } from '../../permission/dtos/permission.dto';
import type { RoleEntity } from '../role.entity';

// TODO, remove this class and use constructor's second argument's type
export type RoleDtoOptions = Partial<{ isActive: boolean }>;

export class RoleDto extends AbstractDto {
    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    isDeleted?: boolean;

    permissions: PermissionDto[];

    constructor(role: RoleEntity) {
        super(role);
        this.name = role.name;
        this.permissions = role.permissions;
        this.isDeleted = role.isDeleted;
    }
}
