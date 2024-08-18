import { MigrationInterface, QueryRunner } from "typeorm";

export class ChannelName1723999415112 implements MigrationInterface {
    name = 'ChannelName1723999415112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "name"`);
    }

}
