import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMedicamentinfoTable1726163548564
  implements MigrationInterface
{
  name = 'CreateMedicamentinfoTable1726163548564';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "medicament_info" ("createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "dosage" character varying NOT NULL, "frequency" integer NOT NULL, "firstTimeOfTheDay" TIMESTAMP NOT NULL, "StartDate" TIMESTAMP NOT NULL, "observation" character varying NOT NULL, "Patient_id" uuid, "Medicine_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_327210e88db0ff6b96032f370f8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "medicament_info" ADD CONSTRAINT "FK_8ee5780dc7050c32788db57b2d6" FOREIGN KEY ("Patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "medicament_info" ADD CONSTRAINT "FK_675afdc7474cfccf79cdd6b6fd9" FOREIGN KEY ("Medicine_id") REFERENCES "medicine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medicament_info" DROP CONSTRAINT "FK_675afdc7474cfccf79cdd6b6fd9"`
    );
    await queryRunner.query(
      `ALTER TABLE "medicament_info" DROP CONSTRAINT "FK_8ee5780dc7050c32788db57b2d6"`
    );
    await queryRunner.query(`DROP TABLE "medicament_info"`);
  }
}
