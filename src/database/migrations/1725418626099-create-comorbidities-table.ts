import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComorbiditiesTable1725418626099
  implements MigrationInterface
{
  name = 'CreateComorbiditiesTable1725418626099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "comorbidity" (
            "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "name" character varying NOT NULL, 
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            CONSTRAINT "UQ_d00f975661f7329605e1d0e7388" UNIQUE ("name"), 
            CONSTRAINT "PK_c7abfff283f4f7fcba82fa3f0f8" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comorbidity"`);
  }
}
