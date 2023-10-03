import type { PipeTransform } from '@nestjs/common';
import {
    applyDecorators,
    Param,
    ParseUUIDPipe,
    SetMetadata,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { Permission } from '@src/constants/permission';
import { REQUIRED_PERMISSIONS } from '@src/constants/permission';
import { PermissionGuard } from '@src/guards/permission.guard';

import { AuthGuard } from '../guards/auth.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PublicRoute } from './public-route.decorator';

export function Auth({
    options = { public: false },
    permissions = [],
}: {
    options?: Partial<{ public: boolean }>;
    permissions?: Permission[];
}): MethodDecorator {
    const isPublicRoute = options.public;

    return applyDecorators(
        SetMetadata(REQUIRED_PERMISSIONS, permissions),
        UseGuards(AuthGuard({ public: isPublicRoute }), PermissionGuard),
        ApiBearerAuth(),
        UseInterceptors(AuthUserInterceptor),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        PublicRoute(isPublicRoute),
    );
}

export function UUIDParam(
    property: string,
    ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
    return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
