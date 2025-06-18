import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1750181548552 implements MigrationInterface {
    name = 'InitTables1750181548552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "auth_type" character varying(20) NOT NULL, "auth_provider" character varying(20) NOT NULL, "access_token" text, "refresh_token" text, "user_id" integer, "expires_at" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_account_user_id" ON "accounts" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_account_user" ON "accounts" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."users_method_enum" AS ENUM('credentials', 'google', 'yandex')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "username" character varying(36) NOT NULL, "method" "public"."users_method_enum" NOT NULL DEFAULT 'credentials', "picture" character varying(200), "is_verified" boolean NOT NULL DEFAULT false, "is_two_factor_enabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_user_email" ON "users" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."tokens_type_enum" AS ENUM('verification', 'two_factor', 'password_reset')`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "email" character varying(50) NOT NULL, "token" text NOT NULL, "type" "public"."tokens_type_enum" NOT NULL, "expires_in" TIMESTAMP NOT NULL, CONSTRAINT "UQ_6a8ca5961656d13c16c04079dd3" UNIQUE ("token"), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TYPE "public"."tokens_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_method_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_account_user"`);
        await queryRunner.query(`DROP INDEX "public"."idx_account_user_id"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
    }

}
