import { MigrationInterface, QueryRunner } from "typeorm";

export class VehiclesOnChannels1724095185913 implements MigrationInterface {
    name = 'VehiclesOnChannels1724095185913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "channelId" uuid`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "channel" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_a1635a4ba909d92c7447a3225ad" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_a1635a4ba909d92c7447a3225ad"`);
        await queryRunner.query(`ALTER TABLE "channel" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "channelId"`);
    }

}
