import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreatePermissionDto } from './dtos/CreatePermissionDto';
import { GetPermissionDto } from './dtos/GetPermissionDto';
import { UpdatePermissionDto } from './dtos/UpdatePermissionDto';
import { PermissionService } from './permission.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.createPermission(createPermissionDto);
    }

    @Get()
    async getPermissions(@Query() getPermissionsDto: GetPermissionDto) {
        return this.permissionService.getPermissions(getPermissionsDto);
    }

    @Put(':id')
    async updatePermission(
        @Param() permissionId: string,
        @Body() updatePermissionDto: UpdatePermissionDto,
    ) {
        return this.permissionService.updatePermission(
            permissionId,
            updatePermissionDto,
        );
    }

    @Delete(':id')
    async deletePermission(@Param() permissionId: string) {
        return this.permissionService.deletePermission(permissionId);
    }
}
