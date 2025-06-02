import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokens1743524858369 implements MigrationInterface {
  name = 'CreateTokens1743524858369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "token" (
            "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "token" character varying(100) NOT NULL, 
            "expiredAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "user_id" uuid NOT NULL, 
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "active" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_e50ca89d635960fda2ffeb17639" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_e50ca89d635960fda2ffeb17639"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "active"`);
    await queryRunner.query(`DROP TABLE "token"`);
  }
}
