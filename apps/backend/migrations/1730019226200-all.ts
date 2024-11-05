import { MigrationInterface, QueryRunner } from 'typeorm';

export class All1730019226200 implements MigrationInterface {
  name = 'All1730019226200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`large_screen\` (\`id\` varchar(36) NOT NULL, \`created_time\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_time\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL COMMENT '页面名称', \`config\` text NOT NULL COMMENT '页面配置', \`is_release\` int NOT NULL COMMENT '状态' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="数据大屏"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`large_screen\``);
  }
}
