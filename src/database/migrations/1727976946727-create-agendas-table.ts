import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAgendasTable1727976946727 implements MigrationInterface {
  name = 'CreateAgendasTable1727976946727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."agenda_day_enum" AS ENUM('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO')`
    );
    await queryRunner.query(
      `CREATE TABLE "agenda" ("createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "day" "public"."agenda_day_enum" NOT NULL DEFAULT 'SEGUNDA', "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_49397cfc20589bebaac8b43251d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(`DROP TABLE "agenda"`);
    await queryRunner.query(`DROP TYPE "public"."agenda_day_enum"`);
  }
}
