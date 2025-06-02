import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBillsTable1732911293563 implements MigrationInterface {
    name = 'CreateBillsTable1732911293563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bill_billtype_enum" AS ENUM('A PAGAR', 'A RECEBER')`);
        await queryRunner.query(`CREATE TYPE "public"."bill_paymenttype_enum" AS ENUM('DINHEIRO', 'CARTAO', 'TRANSFERENCIA', 'PIX')`);
        await queryRunner.query(`CREATE TABLE "bill" (
            "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "amount" double precision NOT NULL, 
            "dueDate" date NOT NULL, 
            "title" character varying NOT NULL, 
            "billType" "public"."bill_billtype_enum" NOT NULL DEFAULT 'A RECEBER', 
            "user_id" uuid, 
            "meeting_id" uuid, 
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "paymentType" "public"."bill_paymenttype_enum", 
            "paymentDate" date, 
            CONSTRAINT "PK_683b47912b8b30fe71d1fa22199" PRIMARY KEY ("id"))`);

        await queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "FK_34e537d6261c55286aa58921ada" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "FK_99fddc7b83f100dd7293620aa3a" FOREIGN KEY ("meeting_id") REFERENCES "meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_99fddc7b83f100dd7293620aa3a"`);
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_34e537d6261c55286aa58921ada"`);
        await queryRunner.query(`DROP TABLE "bill"`);
        await queryRunner.query(`DROP TYPE "public"."bill_paymenttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bill_billtype_enum"`);
    }

}
