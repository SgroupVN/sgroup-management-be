import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Permission } from '@src/constants/permission';
import { REQUIRED_PERMISSIONS } from '@src/constants/permission';
import type { UserEntity } from '@src/modules/user/user.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const requiredPermissions = this.reflector
            .get<Permission[]>(REQUIRED_PERMISSIONS, context.getHandler())
            .reduce((init, current) => {
                init[current.toUpperCase()] = 0;

                return init;
            }, {});

        const request = context.switchToHttp().getRequest();
        const user = <UserEntity>request.user;
        const grantedPermissions = user.role?.permissions || [];

        if (grantedPermissions.length > 0) {
            for (const permission of grantedPermissions) {
                requiredPermissions[permission.name.toUpperCase()] = 1;
            }
        }

        return Object.values(requiredPermissions).every(
            (isPermissionSatisfy) => isPermissionSatisfy === 1,
        );
    }
}
