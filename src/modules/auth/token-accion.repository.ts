import { prisma } from '../../lib/prisma';
import { TipoTokenAccion } from '../../generated/prisma/client';

export class TokenAccionRepository {
    create(data: { usuarioId: number; tokenHash: string; tipo: TipoTokenAccion; expiraEn: Date }) {
        return prisma.tokenAccion.create({ data });
    }

    findByHash(tokenHash: string) {
        return prisma.tokenAccion.findUnique({
            where: { tokenHash },
            include: { usuario: true },
        });
    }

    markAsUsed(id: number) {
        return prisma.tokenAccion.update({
            where: { id },
            data: { usado: true },
        });
    }

    // Invalida tokens pendientes del mismo tipo antes de emitir uno nuevo
    // (ej: reenviar verificación o pedir reset de password varias veces)
    invalidatePending(usuarioId: number, tipo: TipoTokenAccion) {
        return prisma.tokenAccion.updateMany({
            where: { usuarioId, tipo, usado: false },
            data: { usado: true },
        });
    }
}
