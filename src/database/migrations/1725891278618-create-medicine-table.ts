import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMedicineTable1725891278618 implements MigrationInterface {
  name = 'CreateMedicineTable1725891278618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "medicine" (
            "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "name" character varying NOT NULL, 
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            CONSTRAINT "UQ_913974a03c525f2b7681706fcc8" UNIQUE ("name"), 
            CONSTRAINT "PK_b9e0e6f37b7cadb5f402390928b" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "medicine"`);
  }
}
