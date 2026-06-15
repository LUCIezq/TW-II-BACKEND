import { prisma } from '../../lib/prisma';

export const authRepository = {
    findByEmail: (email: string) =>
        prisma.usuario.findUnique({ where: { email } }),

    create: (data: {
        email: string;
        password: string;
        nombre: string;
        apellido: string;
        direccion: string;
    }) => prisma.usuario.create({ data }),
};
