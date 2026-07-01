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
}