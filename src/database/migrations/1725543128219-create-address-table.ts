import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAddressTable1725543128219 implements MigrationInterface {
  name = 'CreateAddressTable1725543128219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "address" ("createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "zipCode" character varying NOT NULL, "street" character varying NOT NULL, "district" character varying NOT NULL, "state" character varying NOT NULL, "homeNumber" integer NOT NULL, "complement" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`
    );
    await queryRunner.query(`DROP TABLE "address"`);
  }
}
