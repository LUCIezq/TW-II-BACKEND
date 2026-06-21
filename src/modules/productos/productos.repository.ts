import { prisma } from "../../lib/prisma";

export class ProductosRepository {
    async getAll() {
        return await prisma.producto.findMany();
    }
}