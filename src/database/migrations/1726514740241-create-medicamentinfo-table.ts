import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMedicamentinfoTable1726514740241
  implements MigrationInterface
{
  name = 'CreateMedicamentinfoTable1726514740241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "medicament_info" (
            "Patient_id" uuid NOT NULL, 
            "Medicine_id" uuid NOT NULL, 
            "dosage" integer NOT NULL, 
            "dosageUnity" character varying NOT NULL, 
            "frequency" integer NOT NULL, 
            "firstTimeOfTheDay" TIMESTAMP NOT NULL, 
            "StartDate" TIMESTAMP NOT NULL, 
            "observation" character varying NOT NULL, 
            CONSTRAINT "PK_e8bc120d38074128754d56ad9a1" PRIMARY KEY ("Patient_id", "Medicine_id"))`);
    await queryRunner.query(
      `ALTER TABLE "medicament_info" ADD CONSTRAINT "FK_8ee5780dc7050c32788db57b2d6" FOREIGN KEY ("Patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
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
