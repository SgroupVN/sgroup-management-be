import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DeleteUsersDto {
    @ApiProperty()
    @Transform((params) => params.value.split(','))
    @IsNotEmpty()
    ids: Array<Uuid>;
}
