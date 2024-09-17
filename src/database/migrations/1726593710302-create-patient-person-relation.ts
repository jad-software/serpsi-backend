import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatientPersonRelation1726593710302
  implements MigrationInterface
{
  name = 'CreatePatientPersonRelation1726593710302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patient" ADD "Person_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "UQ_d5587b4b29d7fd522b8c4bd67f6" UNIQUE ("Person_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_d5587b4b29d7fd522b8c4bd67f6" FOREIGN KEY ("Person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_d5587b4b29d7fd522b8c4bd67f6"`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "UQ_d5587b4b29d7fd522b8c4bd67f6"`
    );
    await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "Person_id"`);
  }
}
