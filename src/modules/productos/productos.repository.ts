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
}