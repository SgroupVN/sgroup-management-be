import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUserTable1696752976493 implements MigrationInterface {
    name = 'ModifyUserTable1696752976493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "late_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "debt" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "major" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "major"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "debt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "late_count"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

}
