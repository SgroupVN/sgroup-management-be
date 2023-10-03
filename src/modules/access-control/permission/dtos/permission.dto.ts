import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '@src/common/dto/abstract.dto';
import { IsNotEmpty } from 'class-validator';

export type PermissionDtoOptions = Partial<{ isActive: boolean }>;

export class PermissionDto extends AbstractDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}
