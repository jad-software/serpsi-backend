import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUnusualTable1732661224058 implements MigrationInterface {
    name = 'CreateUnusualTable1732661224058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "unusual" ("createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date" TIMESTAMP WITH TIME ZONE NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "psychologist_id" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_b1d902bef6a1ee1355a543b6d50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "unusual" ADD CONSTRAINT "FK_fecf0388095c4e9bc2aec3dd36a" FOREIGN KEY ("psychologist_id") REFERENCES "psychologist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "unusual" DROP CONSTRAINT "FK_fecf0388095c4e9bc2aec3dd36a"`);
        await queryRunner.query(`DROP TABLE "unusual"`);
    }

}
