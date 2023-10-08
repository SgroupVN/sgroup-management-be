import { ApiProperty } from '@nestjs/swagger';

import { IsPassword } from '@src/decorators';
import { IsNotEmpty, MinLength } from 'class-validator';

export class RenewPasswordDto {
    @ApiProperty({ type: String, minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    @IsPassword()
    password: string;
}
