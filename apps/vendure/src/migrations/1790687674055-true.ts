import {MigrationInterface, QueryRunner} from "typeorm";

export class True1790687674055 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `product_rating` ADD `ratingSum` int NOT NULL DEFAULT '0'", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `product_rating` DROP COLUMN `ratingSum`", undefined);
   }

}
