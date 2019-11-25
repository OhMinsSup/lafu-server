import { MigrationInterface, QueryRunner } from 'typeorm';

const names = ['user', 'user_profiles', 'user_status', 'auth_tokens', 'verifications'];

export class SetDefaultUUID1568222763601 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (let i = 0; i < names.length; i += 1) {
      await queryRunner.query(
        `ALTER TABLE public.${names[i]} ALTER COLUMN id SET DEFAULT uuid_generate_v4()`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    for (let i = 0; i < names.length; i += 1) {
      await queryRunner.query(`ALTER TABLE public.${names[i]} ALTER COLUMN id SET DEFAULT NULL`);
    }
  }
}
