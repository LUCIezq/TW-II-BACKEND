import { prisma } from '../../lib/prisma';

export const authRepository = {
    findByEmail: (email: string) =>
        prisma.usuario.findUnique({ where: { email } }),
};
