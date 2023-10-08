import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ImportUserDto {
    @ApiProperty()
    @IsNotEmpty()
    importedData: Array<any>;

    @ApiProperty()
    @IsNotEmpty()
    mappedFields: Record<any, any>;
}
