import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1725296392130 implements MigrationInterface {
  name = 'CreateUserTable1725296392130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('PSI', 'ADMIN', 'SECR')`
    );
    await queryRunner.query(
      `CREATE TABLE "user" (
                "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "password" character varying NOT NULL, 
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'PSI', 
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "email" character varying NOT NULL, 
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), 
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user__role_enum"`);
  }
}
