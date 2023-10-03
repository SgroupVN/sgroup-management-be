import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnUserSettings1696363174398 implements MigrationInterface {
    name = 'AddColumnUserSettings1696363174398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" ADD "is_default_password_changed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "is_default_password_changed"`);
    }

}
