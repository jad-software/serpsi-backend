import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePsychologistsTable1727735275978
  implements MigrationInterface
{
  name = 'CreatePsychologistsTable1727735275978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "psychologist" ("createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "identifyLink" character varying NOT NULL, "degreeLink" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "crp" character varying NOT NULL, "crpLink" character varying NOT NULL, CONSTRAINT "UQ_502a8c2603ea409c5cff16695d6" UNIQUE ("crp"), CONSTRAINT "PK_8306b92077e64754cda381819cf" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "city" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddd" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "number" DROP DEFAULT`
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
      `ALTER TABLE "school" ALTER COLUMN "number" SET DEFAULT '999997777'`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddd" SET DEFAULT '74'`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "city" SET DEFAULT 'Salvador'`
    );
    await queryRunner.query(`DROP TABLE "psychologist"`);
  }
}
