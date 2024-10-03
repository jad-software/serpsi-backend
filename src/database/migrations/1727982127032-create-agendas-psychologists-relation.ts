import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAgendasPsychologistsRelation1727982127032 implements MigrationInterface {
    name = 'CreateAgendasPsychologistsRelation1727982127032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "psychologist_agendas_agenda" ("psychologistId" uuid NOT NULL, "agendaId" uuid NOT NULL, CONSTRAINT "PK_97d43b524f2ee241d94044dcd14" PRIMARY KEY ("psychologistId", "agendaId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1f7a9917122d69f82e01881c89" ON "psychologist_agendas_agenda" ("psychologistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5ebb5912481c0a1685ca6a2b5e" ON "psychologist_agendas_agenda" ("agendaId") `);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT +55`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`);
        await queryRunner.query(`ALTER TABLE "psychologist_agendas_agenda" ADD CONSTRAINT "FK_1f7a9917122d69f82e01881c890" FOREIGN KEY ("psychologistId") REFERENCES "psychologist"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "psychologist_agendas_agenda" ADD CONSTRAINT "FK_5ebb5912481c0a1685ca6a2b5eb" FOREIGN KEY ("agendaId") REFERENCES "agenda"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "psychologist_agendas_agenda" DROP CONSTRAINT "FK_5ebb5912481c0a1685ca6a2b5eb"`);
        await queryRunner.query(`ALTER TABLE "psychologist_agendas_agenda" DROP CONSTRAINT "FK_1f7a9917122d69f82e01881c890"`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5ebb5912481c0a1685ca6a2b5e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f7a9917122d69f82e01881c89"`);
        await queryRunner.query(`DROP TABLE "psychologist_agendas_agenda"`);
    }

}
