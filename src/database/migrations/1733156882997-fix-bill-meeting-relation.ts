import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBillMeetingRelation1733156882997 implements MigrationInterface {
    name = 'FixBillMeetingRelation1733156882997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_99fddc7b83f100dd7293620aa3a"`);
        await queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "UQ_99fddc7b83f100dd7293620aa3a" UNIQUE ("meeting_id")`);
        await queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "FK_99fddc7b83f100dd7293620aa3a" FOREIGN KEY ("meeting_id") REFERENCES "meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_99fddc7b83f100dd7293620aa3a"`);
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "UQ_99fddc7b83f100dd7293620aa3a"`);
        await queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "FK_99fddc7b83f100dd7293620aa3a" FOREIGN KEY ("meeting_id") REFERENCES "meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
