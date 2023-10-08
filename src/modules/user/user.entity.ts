import {
    Column,
    Entity,
    JoinTable,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { RoleEntity } from '../access-control/role/role.entity';
import type { UserDtoOptions } from './dtos/user.dto';
import { UserDto } from './dtos/user.dto';
import { UserSettingsEntity } from './user-settings.entity';
import { UserTokenEntity } from './user-token.entity';
import { UserStatus } from '@src/constants/user';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
    @Column({ nullable: true })
    name?: string;

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

    @Column({ default: UserStatus.Active })
    status?: UserStatus;

    @Column({ default: 0 })
    lateCount: number;

    @Column({ default: 0, type: 'float' })
    debt: number;

    @Column({ nullable: true })
    major: string;

    @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
    @JoinTable()
    settings?: UserSettingsEntity;

    @OneToMany(() => UserTokenEntity, (userToken) => userToken.user)
    tokens?: UserTokenEntity[];

    @ManyToOne(() => RoleEntity, (role) => role.user)
    @JoinTable()
    role?: RoleEntity;

    @Column({ type: Boolean, default: false })
    isDeleted: boolean;
}
