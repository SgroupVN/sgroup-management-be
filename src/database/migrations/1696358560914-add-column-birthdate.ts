import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnBirthdate1696358560914 implements MigrationInterface {
    name = 'AddColumnBirthdate1696358560914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "birth_date" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birth_date"`);
    }

}
