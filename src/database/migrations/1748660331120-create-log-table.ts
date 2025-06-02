import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLogTable1748660331120 implements MigrationInterface {
    name = 'CreateLogTable1748660331120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logs" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "level" character varying NOT NULL, 
            "message" character varying NOT NULL, 
            "context" character varying NOT NULL, 
            "meta" jsonb, 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "logs"`);
    }

}
