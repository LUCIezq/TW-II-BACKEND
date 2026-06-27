-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `emailVerificado` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `TokenAccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `tipo` ENUM('VERIFICACION_EMAIL', 'RESET_PASSWORD') NOT NULL,
    `expiraEn` DATETIME(3) NOT NULL,
    `usado` BOOLEAN NOT NULL DEFAULT false,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TokenAccion_tokenHash_key`(`tokenHash`),
    INDEX `TokenAccion_usuarioId_tipo_idx`(`usuarioId`, `tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TokenAccion` ADD CONSTRAINT `TokenAccion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
