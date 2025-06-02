import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatientTable1725548818195 implements MigrationInterface {
  name = 'CreatePatientTable1725548818195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."patient_payment_plan_enum" AS ENUM('AVULSA', 'MENSAL', 'BIMESTRAL', 'TRIMESTRAL')`
    );
    await queryRunner.query(`CREATE TABLE "patient" (
            "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "payment_plan" "public"."patient_payment_plan_enum" NOT NULL DEFAULT 'MENSAL', 
            "School_id" uuid, 
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "patient__comorbidities_comorbidity" (
            "patientId" uuid NOT NULL, 
            "comorbidityId" uuid NOT NULL, 
            CONSTRAINT "PK_9364d87effe24435ce51c5101a8" PRIMARY KEY ("patientId", "comorbidityId"))`);
    await queryRunner.query(
      `CREATE INDEX "IDX_f9e72506bb4b8ebbc6272fc674" ON "patient__comorbidities_comorbidity" ("patientId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3be2de9917205d5fb0828469af" ON "patient__comorbidities_comorbidity" ("comorbidityId") `
    );
    await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "FK_4cd40697b09aa74baffc280aa80" 
            FOREIGN KEY ("School_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "patient__comorbidities_comorbidity" ADD CONSTRAINT "FK_f9e72506bb4b8ebbc6272fc674b" 
            FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "patient__comorbidities_comorbidity" ADD CONSTRAINT "FK_3be2de9917205d5fb0828469af9" 
            FOREIGN KEY ("comorbidityId") REFERENCES "comorbidity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient__comorbidities_comorbidity" DROP CONSTRAINT "FK_3be2de9917205d5fb0828469af9"`
    );
    await queryRunner.query(
      `ALTER TABLE "patient__comorbidities_comorbidity" DROP CONSTRAINT "FK_f9e72506bb4b8ebbc6272fc674b"`
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_4cd40697b09aa74baffc280aa80"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3be2de9917205d5fb0828469af"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f9e72506bb4b8ebbc6272fc674"`
    );
    await queryRunner.query(`DROP TABLE "patient__comorbidities_comorbidity"`);
    await queryRunner.query(`DROP TABLE "patient"`);
    await queryRunner.query(`DROP TYPE "public"."patient_payment_plan_enum"`);
  }
}
