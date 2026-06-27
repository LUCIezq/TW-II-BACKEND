import { prisma } from '../../lib/prisma';

export class AuthRepository {
    findByEmail(email: string) {
        return prisma.usuario.findUnique({ where: { email } });
    }

    create(data: { email: string; password: string; nombre: string; apellido: string; direccion: string }) {
        return prisma.usuario.create({ data });
    }

    markEmailAsVerified(usuarioId: number) {
        return prisma.usuario.update({
            where: { id: usuarioId },
            data: { emailVerificado: true },
        });
    }

    updatePassword(usuarioId: number, hashedPassword: string) {
        return prisma.usuario.update({
            where: { id: usuarioId },
            data: { password: hashedPassword },
        });
    }
}
