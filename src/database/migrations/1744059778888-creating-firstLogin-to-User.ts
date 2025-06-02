import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatingFirstLoginToUser1744059778888 implements MigrationInterface {
    name = 'CreatingFirstLoginToUser1744059778888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "firstLogin" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT +55`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT +55`);
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "expiredAt" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "expiredAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstLogin"`);
    }

}
