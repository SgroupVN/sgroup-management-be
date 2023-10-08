import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Trim } from '../../../decorators/transform.decorators';
import { UserStatus } from '@src/constants/user';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Trim()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Trim()
    readonly email: string;

    @ApiProperty()
    @IsOptional()
    @Trim()
    readonly phone: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Trim()
    @IsString()
    readonly birthDate: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Trim()
    @IsString()
    readonly major: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Trim()
    readonly status: UserStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @Trim()
    readonly lateCount: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Trim()
    readonly debt: number;
}
