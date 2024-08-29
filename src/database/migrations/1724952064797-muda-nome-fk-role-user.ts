import { MigrationInterface, QueryRunner } from "typeorm";

export class MudaNomeFkRoleUser1724952064797 implements MigrationInterface {
    name = 'MudaNomeFkRoleUser1724952064797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "roleId" TO "Role_id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_58f65b84d6c98e9d539ccbda0b2" FOREIGN KEY ("Role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_58f65b84d6c98e9d539ccbda0b2"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "Role_id" TO "roleId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
