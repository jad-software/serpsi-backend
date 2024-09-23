import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePatientParentsRelation1726791733473 implements MigrationInterface {
    name = 'CreatePatientParentsRelation1726791733473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient__parents_person" ("patientId" uuid NOT NULL, "personId" uuid NOT NULL, CONSTRAINT "PK_166ad3e8560c39318fbdf1c18e6" PRIMARY KEY ("patientId", "personId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b3678c38255f59bb8607e58a03" ON "patient__parents_person" ("patientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2fe3561bf20cdcecd9b4b33310" ON "patient__parents_person" ("personId") `);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`);
        await queryRunner.query(`ALTER TABLE "patient__parents_person" ADD CONSTRAINT "FK_b3678c38255f59bb8607e58a03f" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "patient__parents_person" ADD CONSTRAINT "FK_2fe3561bf20cdcecd9b4b333101" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient__parents_person" DROP CONSTRAINT "FK_2fe3561bf20cdcecd9b4b333101"`);
        await queryRunner.query(`ALTER TABLE "patient__parents_person" DROP CONSTRAINT "FK_b3678c38255f59bb8607e58a03f"`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2fe3561bf20cdcecd9b4b33310"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3678c38255f59bb8607e58a03"`);
        await queryRunner.query(`DROP TABLE "patient__parents_person"`);
    }

}
