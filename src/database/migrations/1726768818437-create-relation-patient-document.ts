import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelationPatientDocument1726768818437
  implements MigrationInterface
{
  name = 'CreateRelationPatientDocument1726768818437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document" ADD "Patient_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_19bbaaa316b39c499ce5f819c29" FOREIGN KEY ("Patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_19bbaaa316b39c499ce5f819c29"`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "Patient_id"`);
  }
}
