import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingRelationBetweenPsychologistAndPatient1728748465771
  implements MigrationInterface
{
  name = 'AddingRelationBetweenPsychologistAndPatient1728748465771';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patient" ADD "Psychologist_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_c6d5b7c1346bd34c78f605f461c" FOREIGN KEY ("Psychologist_id") REFERENCES "psychologist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_c6d5b7c1346bd34c78f605f461c"`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "Psychologist_id"`
    );
  }
}
