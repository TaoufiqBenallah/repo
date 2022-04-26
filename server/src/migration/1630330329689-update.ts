import {MigrationInterface, QueryRunner} from "typeorm";

export class update1630330329689 implements MigrationInterface {
    name = 'update1630330329689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactKey" character varying(512) NOT NULL, "activityId" character varying(512) NOT NULL, "journeyId" character varying(512) NOT NULL, "versionId" character varying(512) NOT NULL, "offerId" character varying(512) NOT NULL, "customerName" character varying(512) NOT NULL, "rmName" character varying(512) NOT NULL, "offerName" character varying(512) NOT NULL, "productName" character varying(512) NOT NULL, "beginningDate" character varying(512) NOT NULL, "endDate" character varying(512) NOT NULL, "channel" character varying(512) NOT NULL, "actionStatus" character varying(512) NOT NULL, "actionDetail" character varying(512) NOT NULL, "reprocessCount" integer NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_a58c675c4c129a8e0f63d3676d6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "entry"`);
    }

}
