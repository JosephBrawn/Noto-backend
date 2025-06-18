import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1750282052396 implements MigrationInterface {
    name = 'AddUserRole1750282052396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "coverImageUrl"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "images" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`CREATE TYPE "public"."posts_status_enum" AS ENUM('draft', 'published', 'private')`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "status" "public"."posts_status_enum" NOT NULL DEFAULT 'published'`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('credentials', 'google', 'yandex')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" "public"."users_roles_enum"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "content" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "title" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "title" character varying`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "coverImageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
