import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelationPersonAddress1725544455547 implements MigrationInterface {
  name = 'RelationPersonAddress1725544455547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "person" ADD "address_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_cd587348ca3fec07931de208299" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_cd587348ca3fec07931de208299"`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "address_id"`);
  }
}
