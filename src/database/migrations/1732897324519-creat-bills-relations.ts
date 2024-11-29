import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatBillsRelations1732897324519 implements MigrationInterface {
    name = 'CreatBillsRelations1732897324519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bill" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "bill" ADD "meeting_id" uuid`);
        await queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "FK_34e537d6261c55286aa58921ada" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "FK_99fddc7b83f100dd7293620aa3a" FOREIGN KEY ("meeting_id") REFERENCES "meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_99fddc7b83f100dd7293620aa3a"`);
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_34e537d6261c55286aa58921ada"`);
        await queryRunner.query(`ALTER TABLE "bill" DROP COLUMN "meeting_id"`);
        await queryRunner.query(`ALTER TABLE "bill" DROP COLUMN "user_id"`);
    }

}
