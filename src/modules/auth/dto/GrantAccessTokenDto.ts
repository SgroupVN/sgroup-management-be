import { ApiProperty } from '@nestjs/swagger';

export class GrantAccessTokenDto {
    @ApiProperty({ type: String })
    accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }
}
