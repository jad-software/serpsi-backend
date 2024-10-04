import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAgendasPsychologistsRelation1728003342329
  implements MigrationInterface
{
  name = 'CreateAgendasPsychologistsRelation1728003342329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agenda" ADD "psychologist_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" ADD CONSTRAINT "FK_aa200e3922d52548f1b0b64fc03" FOREIGN KEY ("psychologist_id") REFERENCES "psychologist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
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
      `ALTER TABLE "agenda" DROP COLUMN "psychologist_id"`
    );
  }
}
