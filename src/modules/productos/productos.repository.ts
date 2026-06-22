import { prisma } from "../../lib/prisma";
import type { Producto } from "./entities/ProductoEntity";

export class ProductosRepository {

    async getAll(): Promise<Producto[]> {
        return prisma.producto.findMany({
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