import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionsTable1731365504886 implements MigrationInterface {
  name = 'CreateSessionsTable1731365504886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."meeting_status_enum" AS ENUM('CONFIRMADO', 'CANCELADO', 'ABERTO')`
    );
    await queryRunner.query(
      `CREATE TABLE "meeting" ("createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "schedule" TIMESTAMP NOT NULL, "status" "public"."meeting_status_enum" NOT NULL DEFAULT 'ABERTO', "Patient_id" uuid, "Psychologist_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_dccaf9e4c0e39067d82ccc7bb83" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "document" ADD "Meeting_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "meeting" ADD CONSTRAINT "FK_5d24b93ebc10553c9dba002d063" FOREIGN KEY ("Patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "meeting" ADD CONSTRAINT "FK_679f9a8464a33c12bd6f8ee225a" FOREIGN KEY ("Psychologist_id") REFERENCES "psychologist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_03a58091f1872824de7a5308e91" FOREIGN KEY ("Meeting_id") REFERENCES "meeting"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_03a58091f1872824de7a5308e91"`
    );
    await queryRunner.query(
      `ALTER TABLE "meeting" DROP CONSTRAINT "FK_679f9a8464a33c12bd6f8ee225a"`
    );
    await queryRunner.query(
      `ALTER TABLE "meeting" DROP CONSTRAINT "FK_5d24b93ebc10553c9dba002d063"`
    );
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "Meeting_id"`);
    await queryRunner.query(`DROP TABLE "meeting"`);
    await queryRunner.query(`DROP TYPE "public"."meeting_status_enum"`);
  }
}
