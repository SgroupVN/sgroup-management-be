import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    constructor(data: { accessToken: string; refreshToken: string }) {
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
    }
}
