import { MigrationInterface, QueryRunner } from 'typeorm';

const names = ['user', 'user_profiles', 'user_status', 'auth_tokens', 'verifications'];

export class SetDefaultDate1568222603283 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (let i = 0; i < names.length; i += 1) {
      await queryRunner.query(
        `ALTER TABLE public.${names[i]} ALTER COLUMN updated_at SET DEFAULT now();`
      );
      await queryRunner.query(
        `ALTER TABLE public.${names[i]} ALTER COLUMN created_at SET DEFAULT now();`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    for (let i = 0; i < names.length; i += 1) {
      await queryRunner.query(
        `ALTER TABLE public.${names[i]} ALTER COLUMN updated_at SET DEFAULT NULL;`
      );
      await queryRunner.query(
        `ALTER TABLE public.${names[i]} ALTER COLUMN created_at SET DEFAULT NULL;`
      );
    }
  }
}
