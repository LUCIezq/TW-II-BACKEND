import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

async function main() {
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    await prisma.usuario.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            email: 'test@test.com',
            password: hashedPassword,
            nombre: 'Test',
            apellido: 'User',
            direccion: 'Calle Falsa 123',
        },
    });

    // Categorías
    const notebooks = await prisma.categoria.upsert({
        where: {
            slug: 'notebooks',
        },
        update: {},
        create: {
            nombre: 'Notebooks',
            icono: '',
            slug: 'notebooks',
        },
    });

    const smartphones = await prisma.categoria.upsert({
        where: {
            slug: 'smartphones',
        },
        update: {},
        create: {
            nombre: 'Smartphones',
            icono: '',
            slug: 'smartphones',
        },
    });

    const televisores = await prisma.categoria.upsert({
        where: {
            slug: 'televisores',
        },
        update: {},
        create: {
            nombre: 'Televisores',
            icono: '',
            slug: 'televisores',
        },
    });

    // Productos
    await prisma.producto.upsert({
        where: {
            slug: 'macbook-air-m4',
        },
        update: {},
        create: {
            nombre: 'MacBook Air M4',
            slug: 'macbook-air-m4',
            descripcion: 'Notebook Apple con chip M4 y 16GB RAM',
            precio: 2499999,
            stock: 15,
            imagenUrl: '/images/macbook-air-m4.jpg',
            categoriaId: notebooks.id,
        },
    });

    await prisma.producto.upsert({
        where: {
            slug: 'lenovo-legion-5',
        },
        update: {},
        create: {
            nombre: 'Lenovo Legion 5',
            slug: 'lenovo-legion-5',
            descripcion: 'Notebook gamer Ryzen 7 y RTX 4060',
            precio: 1899999,
            stock: 10,
            imagenUrl: '/images/lenovo-legion-5.jpg',
            categoriaId: notebooks.id,
        },
    });

    await prisma.producto.upsert({
        where: {
            slug: 'samsung-galaxy-s25',
        },
        update: {},
        create: {
            nombre: 'Samsung Galaxy S25',
            slug: 'samsung-galaxy-s25',
            descripcion: 'Smartphone Samsung Galaxy S25 256GB',
            precio: 1299999,
            stock: 25,
            imagenUrl: '/images/samsung-s25.jpg',
            categoriaId: smartphones.id,
        },
    });

    await prisma.producto.upsert({
        where: {
            slug: 'iphone-17',
        },
        update: {},
        create: {
            nombre: 'iPhone 17',
            slug: 'iphone-17',
            descripcion: 'Apple iPhone 17 256GB',
            precio: 1899999,
            stock: 20,
            imagenUrl: '/images/iphone-17.jpg',
            categoriaId: smartphones.id,
        },
    });

    await prisma.producto.upsert({
        where: {
            slug: 'samsung-crystal-uhd-55',
        },
        update: {},
        create: {
            nombre: 'Samsung Crystal UHD 55"',
            slug: 'samsung-crystal-uhd-55',
            descripcion: 'Smart TV Samsung Crystal UHD 55 pulgadas',
            precio: 899999,
            stock: 12,
            imagenUrl: '/images/samsung-crystal-55.jpg',
            categoriaId: televisores.id,
        },
    });

    await prisma.producto.upsert({
        where: {
            slug: 'lg-oled-c5-65',
        },
        update: {},
        create: {
            nombre: 'LG OLED C5 65"',
            slug: 'lg-oled-c5-65',
            descripcion: 'Smart TV LG OLED 65 pulgadas',
            precio: 2499999,
            stock: 8,
            imagenUrl: '/images/lg-oled-c5.jpg',
            categoriaId: televisores.id,
        },
    });

    console.log('Seed ejecutado correctamente!!!!!!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
