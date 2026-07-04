import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export class ProductosRepository {

    getAll(where: Prisma.ProductoWhereInput) {
        return prisma.producto.findMany({
            where,
            include: { categoria: true },
        });
    }

    getProductBySlug(slug: string) {
        return prisma.producto.findUnique({
            where: { slug },
            include: { categoria: true },
        });
    }

    async crearProducto(datos: any) {
        return await prisma.producto.create({
            data: datos
        });
    }

    async actualizarProducto(id: number, datos: any) {
        return await prisma.producto.update({
            where: { id: id },
            data: datos
        });
    }

    async eliminarProducto(id: number) {
        return await prisma.producto.delete({
            where: { id: id }
        });
    }
}
