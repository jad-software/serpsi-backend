import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterPersonTable1749333439653 implements MigrationInterface {
    name = 'AlterPersonTable1749333439653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT '+55'`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT '+55'`);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "ddi" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "ddd" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "number" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "profilePicture" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddi" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddd" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "number" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "number" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddd" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "ddi" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ALTER COLUMN "profilePicture" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "number" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "ddd" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "ddi" SET DEFAULT (+ 55)`);
        await queryRunner.query(`ALTER TABLE "school" ALTER COLUMN "ddi" SET NOT NULL`);
    }

}
