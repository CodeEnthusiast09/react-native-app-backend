import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUpdatedAtColumn1755600713577 implements MigrationInterface {
    name = 'AddedUpdatedAtColumn1755600713577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habits" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habits" DROP COLUMN "updated_at"`);
    }

}
