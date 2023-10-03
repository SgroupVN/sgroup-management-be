import { AbstractEntity } from '@src/common/abstract.entity';
import { UseDto } from '@src/decorators/use-dto.decorator';
import { UserEntity } from '@src/modules/user/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { PermissionEntity } from '../permission/permission.entity';
import type { RoleDtoOptions } from './dtos/role.dto';
import { RoleDto } from './dtos/role.dto';

@Entity({ name: 'roles' })
@UseDto(RoleDto)
export class RoleEntity extends AbstractEntity<RoleDto, RoleDtoOptions> {
    @Column({ nullable: false, unique: true })
    name?: string;

    @Column({ nullable: false, default: false })
    isDeleted: boolean;

    @ManyToMany(() => PermissionEntity)
    @JoinTable()
    permissions: PermissionEntity[];

    @OneToMany(() => UserEntity, (user) => user.role)
    user: UserEntity;
}
