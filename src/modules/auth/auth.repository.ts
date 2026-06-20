import { prisma } from '../../lib/prisma';

export class AuthRepository {
    findByEmail(email: string) {
        return prisma.usuario.findUnique({ where: { email } });
    }

    create(data: { email: string; password: string; nombre: string; apellido: string; direccion: string }) {
        return prisma.usuario.create({ data });
    }
}
