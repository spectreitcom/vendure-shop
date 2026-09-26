import {MigrationInterface, QueryRunner} from "typeorm";

export class True1790418030891 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `favorite_products_entity` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `customerId` int NOT NULL, `productVariantId` int NOT NULL, `channelId` int NOT NULL, UNIQUE INDEX `IDX_4d15aaea57f5599ae8c3950817` (`customerId`, `productVariantId`, `channelId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `favorite_products_entity` ADD CONSTRAINT `FK_65e49a7917a06d76a95b0f6b5c8` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `favorite_products_entity` ADD CONSTRAINT `FK_547876da1538ced06cfaeccf47a` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `favorite_products_entity` ADD CONSTRAINT `FK_314f3394037a39ad14feafc3161` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `favorite_products_entity` DROP FOREIGN KEY `FK_314f3394037a39ad14feafc3161`", undefined);
        await queryRunner.query("ALTER TABLE `favorite_products_entity` DROP FOREIGN KEY `FK_547876da1538ced06cfaeccf47a`", undefined);
        await queryRunner.query("ALTER TABLE `favorite_products_entity` DROP FOREIGN KEY `FK_65e49a7917a06d76a95b0f6b5c8`", undefined);
        await queryRunner.query("DROP INDEX `IDX_4d15aaea57f5599ae8c3950817` ON `favorite_products_entity`", undefined);
        await queryRunner.query("DROP TABLE `favorite_products_entity`", undefined);
   }

}
