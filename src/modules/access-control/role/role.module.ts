import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionModule } from '../permission/permission.module';
import { RoleController } from './role.controller';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity]), PermissionModule],
    controllers: [RoleController],
    exports: [RoleService],
    providers: [RoleService],
})
export class RoleModule {}
