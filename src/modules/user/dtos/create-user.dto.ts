import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';

import { Trim } from '../../../decorators/transform.decorators';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Trim()
    readonly firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Trim()
    readonly lastName: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Trim()
    readonly email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber()
    @Trim()
    readonly phone: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Trim()
    readonly birthDate: string;
}
