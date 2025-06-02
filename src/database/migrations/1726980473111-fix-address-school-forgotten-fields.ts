import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixAddressSchoolForgottenFields1726980473111
  implements MigrationInterface
{
  name = 'FixAddressSchoolForgottenFields1726980473111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" ADD "city" character varying NOT NULL DEFAULT 'Salvador'`
    );
    await queryRunner.query(`ALTER TABLE "school" ADD "Address_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "school" ADD "ddi" character varying NOT NULL DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ADD "ddd" character varying NOT NULL DEFAULT 74`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ADD "number" character varying NOT NULL DEFAULT 999997777`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ADD CONSTRAINT "FK_d1baaf8526ccab8ed3851829861" FOREIGN KEY ("Address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "school" DROP CONSTRAINT "FK_d1baaf8526ccab8ed3851829861"`
    );
    await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "number"`);
    await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "ddd"`);
    await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "ddi"`);
    await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "Address_id"`);
    await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "city"`);
  }
}
