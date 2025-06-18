import { MigrationInterface, QueryRunner } from "typeorm";

export class EditUserRole1750282545158 implements MigrationInterface {
    name = 'EditUserRole1750282545158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."users_roles_enum" RENAME TO "users_roles_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('user', 'moderator', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" TYPE "public"."users_roles_enum" USING "roles"::"text"::"public"."users_roles_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" DROP DEFAULT`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum_old" AS ENUM('credentials', 'google', 'yandex')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" TYPE "public"."users_roles_enum_old" USING "roles"::"text"::"public"."users_roles_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_roles_enum_old" RENAME TO "users_roles_enum"`);
    }

}
