import { prisma } from '../../lib/prisma';
import type { UsuarioEntity } from './entities/UsuarioEntity';

export class AuthRepository {
    findByEmail(email: string): Promise<UsuarioEntity | null> {
        return prisma.usuario.findUnique({ where: { email } });
    }

    create(data: { email: string; password: string; nombre: string; apellido: string; direccion: string }): Promise<UsuarioEntity> {
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
