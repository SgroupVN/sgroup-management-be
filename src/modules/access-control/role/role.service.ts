import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageDto } from '@src/common/dto/page.dto';
import { RoleNotFoundException } from '@src/exceptions/role-not-found.exception';
import type { FindOneOptions } from 'typeorm';
import { Repository } from 'typeorm';

import type { CreateRoleDto } from './dtos/CreateRoleDto';
import type { GetRoleDto } from './dtos/GetRoleDto';
import type { RoleDto } from './dtos/role.dto';
import { RoleEntity } from './role.entity';
import { RoleType } from '@src/constants';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>,
    ) {}

    createOne(createRoleDto: CreateRoleDto) {
        return this.roleRepository.save(createRoleDto);
    }

    async getRoles(queryCriterias: GetRoleDto): Promise<PageDto<RoleDto>> {
        const queryBuilder = this.roleRepository.createQueryBuilder();

        queryBuilder.where('is_deleted = :isDeleted', { isDeleted: false });

        if (queryCriterias.name) {
            queryBuilder.andWhere('name LIKE :name', {
                name: `%${queryCriterias.name}%`,
            });
        }

        const [items, pageMetaDto] =
            await queryBuilder.paginate(queryCriterias);

        return items.toPageDto(pageMetaDto);
    }

    async getById(roleId: string): Promise<RoleDto | undefined> {
        const role = await this.roleRepository.findOne({
            where: { id: roleId, isDeleted: false },
        } as FindOneOptions<RoleEntity>);

        return role?.toDto();
    }

    async getByName(roleName: RoleType): Promise<RoleDto | undefined> {
        const role = await this.roleRepository.findOne({
            where: { name: roleName, isDeleted: false },
        } as FindOneOptions<RoleEntity>);

        return role?.toDto();
    }

    async deleteById(roleId: string) {
        return this.roleRepository
            .createQueryBuilder()
            .update()
            .set({ isDeleted: true })
            .where('id = :roleId', { roleId })
            .execute();
    }

    async attachPermissions({
        roleId,
        permissionIds,
    }: {
        roleId: string;
        permissionIds: string[];
    }) {
        const role = await this.roleRepository.findOne({
            where: {
                id: roleId,
            },
            relations: {
                permissions: true,
            },
        } as FindOneOptions<RoleEntity>);

        if (!role) {
            throw new RoleNotFoundException();
        }

        return this.roleRepository
            .createQueryBuilder()
            .relation(RoleEntity, 'permissions')
            .of(role)
            .add(permissionIds);
    }

    async revokePermissions({
        roleId,
        permissionIds,
    }: {
        roleId: string;
        permissionIds: string[];
    }) {
        const role = await this.roleRepository.findOne({
            where: {
                id: roleId,
            },
            relations: {
                permissions: true,
            },
        } as FindOneOptions<RoleEntity>);

        if (!role) {
            throw new RoleNotFoundException();
        }

        return this.roleRepository
            .createQueryBuilder()
            .relation(RoleEntity, 'permissions')
            .of(role)
            .remove(permissionIds);
    }
}
