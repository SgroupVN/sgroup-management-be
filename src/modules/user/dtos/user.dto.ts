import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { RoleDto } from '@src/modules/access-control/role/dtos/role.dto';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { UserEntity } from '../user.entity';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
    @ApiPropertyOptional()
    firstName?: string;

    @ApiPropertyOptional()
    lastName?: string;

    @ApiProperty()
    username: string;

    @ApiPropertyOptional()
    email?: string;

    @ApiPropertyOptional()
    avatar?: string;

    @ApiPropertyOptional()
    phone?: string;

    @ApiPropertyOptional()
    isActive?: boolean;

    @ApiPropertyOptional()
    birthDate: Date;

    role?: RoleDto;

    constructor(user: UserEntity, options?: UserDtoOptions) {
        super(user);
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.avatar = user.avatar;
        this.phone = user.phone;
        this.isActive = options?.isActive;
        this.role = user.role?.toDto();
    }
}
