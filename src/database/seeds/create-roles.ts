import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RoleEntity } from '@src/modules/access-control/role/role.entity';

export default class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into(RoleEntity)
            .values([{ name: 'ADMIN' }, { name: 'MEMBER' }])
            .orIgnore()
            .execute();
    }
}
