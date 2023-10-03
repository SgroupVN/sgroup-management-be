import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageDto } from '@src/common/dto/page.dto';
import { Repository } from 'typeorm';

import type { CreatePermissionDto } from './dtos/CreatePermissionDto';
import type { GetPermissionDto } from './dtos/GetPermissionDto';
import type { PermissionDto } from './dtos/permission.dto';
import { PermissionEntity } from './permission.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(PermissionEntity)
        private readonly permissionRepository: Repository<PermissionEntity>,
    ) {}

    createPermission(createPermissionDto: CreatePermissionDto) {
        return this.permissionRepository.save(createPermissionDto);
    }

    async getPermissions(
        queryCriterias: GetPermissionDto,
    ): Promise<PageDto<PermissionDto>> {
        const queryBuilder = this.permissionRepository.createQueryBuilder();

        queryBuilder.where('is_deleted = :isDeleted', { isDeleted: false });

        if (queryCriterias.name) {
            queryBuilder.andWhere('name LIKE :name', {
                name: `%${queryCriterias.name}%`,
            });
        }

        if (queryCriterias.domain) {
            queryBuilder.andWhere('domain = :domain', {
                domain: queryCriterias.domain,
            });
        }

        const [items, pageMetaDto] =
            await queryBuilder.paginate(queryCriterias);

        return items.toPageDto(pageMetaDto);
    }

    deletePermission(permissionId: string) {
        return this.permissionRepository
            .createQueryBuilder()
            .update()
            .set({ isDeleted: true })
            .where('id = :permissionId', { permissionId })
            .execute();
    }

    updatePermission(
        permissionId: string,
        updatePermissionDto: Partial<CreatePermissionDto>,
    ) {
        const query = this.permissionRepository
            .createQueryBuilder()
            .update()
            .set({
                name: updatePermissionDto.name,
                domain: updatePermissionDto.domain,
                description: updatePermissionDto.description,
            })
            .where('id := permissionId', { permissionId });

        return query.execute();
    }
}
