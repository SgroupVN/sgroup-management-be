import { AbstractEntity } from '@src/common/abstract.entity';
import { UseDto } from '@src/decorators/use-dto.decorator';
import { Column, Entity } from 'typeorm';

import { PermissionDto } from './dtos/permission.dto';

@Entity({ name: 'permissions' })
@UseDto(PermissionDto)
export class PermissionEntity extends AbstractEntity<PermissionDto> {
    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: true, type: String })
    description: string;

    @Column({ nullable: true, type: String })
    domain?: string;

    @Column({ nullable: false, default: false })
    isDeleted: boolean;
}
