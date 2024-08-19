import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVehicleName1724075188777 implements MigrationInterface {
    name = 'CreateVehicleName1724075188777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "name"`);
    }

}
