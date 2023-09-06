import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { PageDto } from '@src/common/dto/page.dto';

import { RolePermissionsDto } from './dtos/AttachPermissionsDto';
import { CreateRoleDto } from './dtos/CreateRoleDto';
import { GetRoleDto } from './dtos/GetRoleDto';
import type { RoleDto } from './dtos/role.dto';
import { RoleService } from './role.service';

@Controller('roles')
@ApiTags('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createOne(createRoleDto);
  }

  @Get()
  getRoles(@Query() queryCriterias: GetRoleDto): Promise<PageDto<RoleDto>> {
    return this.roleService.getRoles(queryCriterias);
  }

  @Get(':id')
  getRole(@Param('id') roleId: string) {
    return this.roleService.getById(roleId);
  }

  @Delete(':id')
  deleteRole(@Param('id') roleId: string) {
    return this.roleService.deleteById(roleId);
  }

  @Post(':roleId/permissions')
  attachPermissions(
    @Param('roleId') roleId: string,
    @Body() attachPermissionsDto: RolePermissionsDto,
  ) {
    return this.roleService.attachPermissions({
      roleId,
      permissionIds: attachPermissionsDto.permissionIds,
    });
  }

  @Delete(':roleId/permissions')
  revokeRolePermissions(
    @Param('roleId') roleId: string,
    @Query() rolePermissionsDto: RolePermissionsDto,
  ) {
    return this.roleService.revokePermissions({
      roleId,
      permissionIds: rolePermissionsDto.permissionIds,
    });
  }
}
