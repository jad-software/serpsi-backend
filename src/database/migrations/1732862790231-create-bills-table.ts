import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBillsTable1732862790231 implements MigrationInterface {
    name = 'CreateBillsTable1732862790231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bill_billtype_enum" AS ENUM('A PAGAR', 'A RECEBER')`);
        await queryRunner.query(`CREATE TYPE "public"."bill_paymenttype_enum" AS ENUM('DINHEIRO', 'CARTAO', 'TRANSFERENCIA', 'PIX')`);
        await queryRunner.query(`CREATE TABLE "bill" (
            "createDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "amount" integer NOT NULL, 
            "dueDate" date NOT NULL, 
            "title" character varying NOT NULL, 
            "billType" "public"."bill_billtype_enum" NOT NULL DEFAULT 'A RECEBER', 
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "paymentType" "public"."bill_paymenttype_enum", 
            "paymentDate" date, CONSTRAINT "PK_683b47912b8b30fe71d1fa22199" PRIMARY KEY ("id"))`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {;
        await queryRunner.query(`DROP TABLE "bill"`);
        await queryRunner.query(`DROP TYPE "public"."bill_paymenttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bill_billtype_enum"`);
    }

}
