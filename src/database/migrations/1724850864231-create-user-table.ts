import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1724850864231 implements MigrationInterface {
    name = 'CreateUserTable1724850864231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "idId" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_d586aa4a6a63ab6f8eece7f7588" PRIMARY KEY ("idId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying NOT NULL, "roleId" uuid, "idId" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_35975e959a8c70872f8c4ced97a" PRIMARY KEY ("idId"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("idId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
