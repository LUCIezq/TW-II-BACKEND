import type { Categoria } from "../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";

export class CategoriaRepository {
    getCategorias = (): Promise<Categoria[]> => {
        return prisma.categoria.findMany();
    }
}