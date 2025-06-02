import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingValueAndDuartionToPsychologist1728049822915
  implements MigrationInterface
{
  name = 'AddingValueAndDuartionToPsychologist1728049822915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agenda" DROP CONSTRAINT "FK_aa200e3922d52548f1b0b64fc03"`
    );
    await queryRunner.query(
      `ALTER TABLE "psychologist" ADD "meetValue" numeric NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "psychologist" ADD "meetDuration" integer NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" ADD CONSTRAINT "FK_aa200e3922d52548f1b0b64fc03" FOREIGN KEY ("psychologist_id") REFERENCES "psychologist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agenda" DROP CONSTRAINT "FK_aa200e3922d52548f1b0b64fc03"`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "psychologist" DROP COLUMN "meetDuration"`
    );
    await queryRunner.query(
      `ALTER TABLE "psychologist" DROP COLUMN "meetValue"`
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" ADD CONSTRAINT "FK_aa200e3922d52548f1b0b64fc03" FOREIGN KEY ("psychologist_id") REFERENCES "psychologist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
