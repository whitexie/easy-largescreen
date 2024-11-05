import { MigrationInterface, QueryRunner } from 'typeorm';

export class All1730617333478 implements MigrationInterface {
  name = 'All1730617333478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`large_screen\` DROP COLUMN \`config\``);
    await queryRunner.query(`ALTER TABLE \`large_screen\` ADD \`widgets\` text NOT NULL COMMENT '页面组件'`);
    await queryRunner.query(`ALTER TABLE \`large_screen\` ADD \`page_config\` text NOT NULL COMMENT '页面配置'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`large_screen\` DROP COLUMN \`page_config\``);
    await queryRunner.query(`ALTER TABLE \`large_screen\` DROP COLUMN \`widgets\``);
    await queryRunner.query(`ALTER TABLE \`large_screen\` ADD \`config\` text NOT NULL COMMENT '页面配置'`);
  }
}
