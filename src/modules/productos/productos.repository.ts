import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type ProductFilter from "./interfaces/ProductFilter";

export class ProductosRepository {

    getAll(filters: ProductFilter) {
        const where: Prisma.ProductoWhereInput = {};

        if (filters.nombre) where.nombre = { contains: filters.nombre };
        if (filters.categoriaId) where.categoriaId = Number(filters.categoriaId);

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
