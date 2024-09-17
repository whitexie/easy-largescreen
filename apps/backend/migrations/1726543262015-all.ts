import { MigrationInterface, QueryRunner } from 'typeorm';

export class All1726543262015 implements MigrationInterface {
  name = 'All1726543262015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sales_data\` CHANGE \`id\` \`id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`sales_data\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`sales_data\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`sales_data\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`field\` DROP FOREIGN KEY \`FK_4803e7df9800fd0c4a8d4a1cd6e\``);
    await queryRunner.query(`ALTER TABLE \`field\` CHANGE \`id\` \`id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`field\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`field\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`field\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`field\` DROP COLUMN \`dataset_id\``);
    await queryRunner.query(`ALTER TABLE \`field\` ADD \`dataset_id\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`dataset\` CHANGE \`id\` \`id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`dataset\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`dataset\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`dataset\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`field\` ADD CONSTRAINT \`FK_4803e7df9800fd0c4a8d4a1cd6e\` FOREIGN KEY (\`dataset_id\`) REFERENCES \`dataset\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`field\` DROP FOREIGN KEY \`FK_4803e7df9800fd0c4a8d4a1cd6e\``);
    await queryRunner.query(`ALTER TABLE \`dataset\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`dataset\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`dataset\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(`ALTER TABLE \`dataset\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`field\` DROP COLUMN \`dataset_id\``);
    await queryRunner.query(`ALTER TABLE \`field\` ADD \`dataset_id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`field\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`field\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`field\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(`ALTER TABLE \`field\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`field\` ADD CONSTRAINT \`FK_4803e7df9800fd0c4a8d4a1cd6e\` FOREIGN KEY (\`dataset_id\`) REFERENCES \`dataset\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE \`sales_data\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`sales_data\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`sales_data\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(`ALTER TABLE \`sales_data\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
  }
}
