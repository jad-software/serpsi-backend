import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakingSchoolOptional1732417445859 implements MigrationInterface {
  name = 'MakingSchoolOptional1732417445859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "homeNumber" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ALTER COLUMN "School_id" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "homeNumber" SET DEFAULT '0000'`
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ALTER COLUMN "School_id" SET NOT NULL`
    );
  }
}
