import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelationPersonUser1725976965543 implements MigrationInterface {
  name = 'RelationPersonUser1725976965543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "person" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "UQ_5157fa65538cae06e66c922c898" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_5157fa65538cae06e66c922c898" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_5157fa65538cae06e66c922c898"`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "UQ_5157fa65538cae06e66c922c898"`
    );
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "user_id"`);
  }
}
