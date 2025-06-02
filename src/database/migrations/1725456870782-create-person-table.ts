import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePersonTable1725456870782 implements MigrationInterface {
  name = 'CreatePersonTable1725456870782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "person" ("createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "rg" character varying NOT NULL, "profilePicture" character varying NOT NULL, "birthdate" TIMESTAMP NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ddi" character varying NOT NULL DEFAULT +55, "ddd" character varying NOT NULL, "number" character varying NOT NULL, "cpf" character varying NOT NULL, CONSTRAINT "UQ_690554d08986f72266f0f0ff79d" UNIQUE ("rg"), CONSTRAINT "UQ_264b7cad2330569e0ef5b4c39c4" UNIQUE ("cpf"), CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "person"`);
  }
}
