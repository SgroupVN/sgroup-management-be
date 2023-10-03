import {
    Column,
    Entity,
    JoinTable,
    ManyToOne,
    OneToMany,
    OneToOne,
    VirtualColumn,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { RoleEntity } from '../access-control/role/role.entity';
import type { UserDtoOptions } from './dtos/user.dto';
import { UserDto } from './dtos/user.dto';
import { UserSettingsEntity } from './user-settings.entity';
import { UserTokenEntity } from './user-token.entity';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ unique: true, nullable: false })
    email?: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ nullable: true })
    birthDate?: string;

    @VirtualColumn({
        query: (alias) =>
            `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
    })
    fullName?: string;

    @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
    @JoinTable()
    settings?: UserSettingsEntity;

    @OneToMany(() => UserTokenEntity, (userToken) => userToken.user)
    tokens?: UserTokenEntity[];

    @ManyToOne(() => RoleEntity, (role) => role.user)
    @JoinTable()
    role?: RoleEntity;

    @Column({ nullable: false, type: Boolean, default: true })
    isActive: boolean;

    @Column({ nullable: false, type: Boolean, default: false })
    isDeleted: boolean;
}
