import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchoolTable1725393439582 implements MigrationInterface {
  name = 'CreateSchoolTable1725393439582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "school" (
            "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "name" character varying NOT NULL, 
            "CNPJ" character varying NOT NULL, 
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            CONSTRAINT "UQ_73c2a2b94ffa6b0fabf50b64743" UNIQUE ("name"), 
            CONSTRAINT "UQ_a94bfbb404c8e741d1c2a698358" UNIQUE ("CNPJ"), 
            CONSTRAINT "PK_57836c3fe2f2c7734b20911755e" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `CREATE INDEX "IDX_73c2a2b94ffa6b0fabf50b6474" ON "school" ("name") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_73c2a2b94ffa6b0fabf50b6474"`
    );
    await queryRunner.query(`DROP TABLE "school"`);
  }
}
