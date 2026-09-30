import {MigrationInterface, QueryRunner} from "typeorm";

export class True1790681977811 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `product_rating_bought_product_variant` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `rating` int NOT NULL DEFAULT '0', `id` int NOT NULL AUTO_INCREMENT, `productVariantId` int NOT NULL, `customerId` int NOT NULL, `channelId` int NOT NULL, UNIQUE INDEX `IDX_7b0a8edaffbd421326665af9c9` (`productVariantId`, `customerId`, `channelId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `product_rating` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `average` float NOT NULL DEFAULT '0', `votes` int NOT NULL DEFAULT '0', `id` int NOT NULL AUTO_INCREMENT, `productVariantId` int NOT NULL, `channelId` int NOT NULL, UNIQUE INDEX `IDX_8b6c5dbe7d29d2a4488e970593` (`productVariantId`, `channelId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `product_rating_bought_product_variant` ADD CONSTRAINT `FK_d12144d00dcb7e947f430feb6ae` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `product_rating_bought_product_variant` ADD CONSTRAINT `FK_46117a058aa5479c47e6c2189e6` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `product_rating_bought_product_variant` ADD CONSTRAINT `FK_baa3a78ed16aee0c887bb876bc1` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `product_rating` ADD CONSTRAINT `FK_884704decdc0ce66563fdedb3d7` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `product_rating` ADD CONSTRAINT `FK_c802eb6db27aa6eafe26f852ec8` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `product_rating` DROP FOREIGN KEY `FK_c802eb6db27aa6eafe26f852ec8`", undefined);
        await queryRunner.query("ALTER TABLE `product_rating` DROP FOREIGN KEY `FK_884704decdc0ce66563fdedb3d7`", undefined);
        await queryRunner.query("ALTER TABLE `product_rating_bought_product_variant` DROP FOREIGN KEY `FK_baa3a78ed16aee0c887bb876bc1`", undefined);
        await queryRunner.query("ALTER TABLE `product_rating_bought_product_variant` DROP FOREIGN KEY `FK_46117a058aa5479c47e6c2189e6`", undefined);
        await queryRunner.query("ALTER TABLE `product_rating_bought_product_variant` DROP FOREIGN KEY `FK_d12144d00dcb7e947f430feb6ae`", undefined);
        await queryRunner.query("DROP INDEX `IDX_8b6c5dbe7d29d2a4488e970593` ON `product_rating`", undefined);
        await queryRunner.query("DROP TABLE `product_rating`", undefined);
        await queryRunner.query("DROP INDEX `IDX_7b0a8edaffbd421326665af9c9` ON `product_rating_bought_product_variant`", undefined);
        await queryRunner.query("DROP TABLE `product_rating_bought_product_variant`", undefined);
   }

}
