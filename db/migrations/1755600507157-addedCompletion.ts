import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCompletion1755600507157 implements MigrationInterface {
    name = 'AddedCompletion1755600507157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "habit_completions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "completed_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "habit_id" uuid, CONSTRAINT "PK_6cd5cba8604717303b951f3aa1c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "habit_completions" ADD CONSTRAINT "FK_074ec16420ef7425e584774ee03" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit_completions" DROP CONSTRAINT "FK_074ec16420ef7425e584774ee03"`);
        await queryRunner.query(`DROP TABLE "habit_completions"`);
    }

}
