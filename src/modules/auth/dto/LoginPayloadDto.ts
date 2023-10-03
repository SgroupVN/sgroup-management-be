import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../user/dtos/user.dto';
import { TokenPayloadDto } from './TokenPayloadDto';
import { UserSettingsEntity } from '@src/modules/user/user-settings.entity';

export class LoginPayloadDto {
    @ApiProperty({ type: UserDto })
    user: UserDto;

    @ApiProperty({ type: TokenPayloadDto })
    token: TokenPayloadDto;

    @ApiProperty({ type: UserSettingsEntity })
    metaData: Partial<UserSettingsEntity>;

    constructor(
        user: UserDto,
        token: TokenPayloadDto,
        userSettings: Partial<UserSettingsEntity> = {},
    ) {
        this.user = user;
        this.token = token;
        this.metaData = userSettings;
    }
}
