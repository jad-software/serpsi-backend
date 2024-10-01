import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePsychologistsUserRelation1727740533718
  implements MigrationInterface
{
  name = 'CreatePsychologistsUserRelation1727740533718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "psychologist" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "psychologist" ADD CONSTRAINT "UQ_3d01d3c4088f492ee26c2eef2ff" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "psychologist" ADD CONSTRAINT "FK_3d01d3c4088f492ee26c2eef2ff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "psychologist" DROP CONSTRAINT "FK_3d01d3c4088f492ee26c2eef2ff"`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "psychologist" DROP CONSTRAINT "UQ_3d01d3c4088f492ee26c2eef2ff"`
    );
    await queryRunner.query(`ALTER TABLE "psychologist" DROP COLUMN "user_id"`);
  }
}
