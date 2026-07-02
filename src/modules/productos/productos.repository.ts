import { prisma } from "../../lib/prisma";
import type { Producto } from "./entities/ProductoEntity";

export class ProductosRepository {

    async getAll(categoria?: string): Promise<Producto[]> {
        return prisma.producto.findMany({
            where: categoria ? {
                categoria: {
                    slug: categoria
                }
            } : undefined,
            include: {
                categoria: true
            }
        });
    }

    async getProductBySlug(slug: string): Promise<Producto | null> {
        return prisma.producto.findUnique({
            where: {
                slug
            },
            include: {
                categoria: true
            }
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