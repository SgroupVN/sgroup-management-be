import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import type { UserDtoOptions } from './dtos/user.dto';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_tokens' })
@UseDto(UserDto)
export class UserTokenEntity extends AbstractEntity<UserDto, UserDtoOptions> {
    @Column({ type: String })
    refreshToken?: string;

    @Column({ type: 'uuid' })
    userId?: string;

    @Column({ type: Boolean, default: false })
    revoked?: boolean;

    @OneToMany(() => UserEntity, (user) => user.tokens, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user?: UserEntity;
}
