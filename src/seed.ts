import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma';

async function main() {
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    await prisma.usuario.upsert({
        where: { email: 'test@test.com' },
        update: { emailVerificado: true },
        create: {
            email: 'test@test.com',
            password: hashedPassword,
            nombre: 'Test',
            apellido: 'User',
            direccion: 'Calle Falsa 123',
            emailVerificado: true,
        },
    });

    console.log('Seed OK — test@test.com / Password123!');
}

main()
    .catch(console.error)
    .finally(() => void prisma.$disconnect());
