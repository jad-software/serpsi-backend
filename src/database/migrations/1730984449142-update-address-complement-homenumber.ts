import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAddressComplementHomenumber1730984449142
  implements MigrationInterface
{
  name = 'UpdateAddressComplementHomenumber1730984449142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "homeNumber"`);
    await queryRunner.query(
      `ALTER TABLE "address" ADD "homeNumber" character varying NOT NULL DEFAULT '0000'`
    );
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "complement" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "complement" SET NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "homeNumber"`);
    await queryRunner.query(
      `ALTER TABLE "address" ADD "homeNumber" integer NOT NULL`
    );
  }
}
