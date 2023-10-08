import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { RoleDto } from '@src/modules/access-control/role/dtos/role.dto';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { UserEntity } from '../user.entity';
import { UserStatus } from '@src/constants/user';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
    @ApiProperty()
    name?: string;

    @ApiProperty()
    email?: string;

    @ApiPropertyOptional()
    avatar?: string;

    @ApiProperty()
    phone?: string;

    @ApiProperty()
    status?: UserStatus;

    @ApiProperty()
    lateCount?: number;

    @ApiProperty()
    debt?: number;

    @ApiProperty()
    major?: string;

    @ApiPropertyOptional()
    birthDate?: string;

    @ApiProperty()
    isDeleted: boolean;

    role?: RoleDto;

    constructor(user: UserEntity) {
        super(user);
        this.name = user.name;
        this.lateCount = user.lateCount;
        this.debt = user.debt;
        this.status = user.status;
        this.major = user.major;
        this.email = user.email;
        this.avatar = user.avatar;
        this.phone = user.phone;
        this.isDeleted = user.isDeleted;
        this.birthDate = user.birthDate;
        this.isDeleted = user.isDeleted;
        this.role = user.role?.toDto();
    }
}
