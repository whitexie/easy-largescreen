import { MigrationInterface, QueryRunner } from 'typeorm';

export class All1726543143798 implements MigrationInterface {
  name = 'All1726543143798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`sales_data\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_time\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_time\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`province\` varchar(255) NOT NULL COMMENT '省份', \`province_code\` varchar(255) NOT NULL COMMENT '省份代码', \`city\` varchar(255) NOT NULL COMMENT '城市', \`city_code\` varchar(255) NOT NULL COMMENT '城市代码', \`district\` varchar(255) NOT NULL COMMENT '区县', \`district_code\` varchar(255) NOT NULL COMMENT '区县代码', \`date\` date NOT NULL COMMENT '日期', \`product_category\` varchar(255) NOT NULL COMMENT '商品分类', \`product_name\` varchar(255) NOT NULL COMMENT '商品名称', \`unit\` varchar(255) NOT NULL COMMENT '单位', \`origin\` varchar(255) NOT NULL COMMENT '产地', \`tax_included_price\` decimal(15,4) NOT NULL COMMENT '含税价', \`retail_price\` decimal(15,4) NOT NULL COMMENT '零售价', \`order_quantity\` int NOT NULL COMMENT '订购数量', \`sales_amount\` decimal(15,4) NOT NULL COMMENT '销售金额', \`delivery_quantity\` int NOT NULL COMMENT '配送数', \`sales_quantity\` int NOT NULL COMMENT '销售数量', \`longitude\` decimal(10,6) NOT NULL COMMENT '经度', \`latitude\` decimal(10,6) NOT NULL COMMENT '纬度', \`region\` varchar(255) NOT NULL COMMENT '大区', PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="销售数据"`);
    await queryRunner.query(`CREATE TABLE \`dataset\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_time\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_time\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`dataset_code\` varchar(36) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_b5272877eef092f62bdba28c57\` (\`dataset_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="数据集"`);
    await queryRunner.query(`CREATE TABLE \`field\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_time\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_time\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dataset_code\` varchar(255) NOT NULL, \`field_code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`value_type\` enum ('string', 'number', 'date') NOT NULL, \`dataset_id\` int NOT NULL, UNIQUE INDEX \`IDX_b8c3fb6a47ecf203c7faf64dac\` (\`dataset_code\`, \`field_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="字段表"`);
    await queryRunner.query(`ALTER TABLE \`field\` ADD CONSTRAINT \`FK_4803e7df9800fd0c4a8d4a1cd6e\` FOREIGN KEY (\`dataset_id\`) REFERENCES \`dataset\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`field\` DROP FOREIGN KEY \`FK_4803e7df9800fd0c4a8d4a1cd6e\``);
    await queryRunner.query(`DROP INDEX \`IDX_b8c3fb6a47ecf203c7faf64dac\` ON \`field\``);
    await queryRunner.query(`DROP TABLE \`field\``);
    await queryRunner.query(`DROP INDEX \`IDX_b5272877eef092f62bdba28c57\` ON \`dataset\``);
    await queryRunner.query(`DROP TABLE \`dataset\``);
    await queryRunner.query(`DROP TABLE \`sales_data\``);
  }
}
