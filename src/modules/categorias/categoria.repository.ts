import { prisma } from "../../lib/prisma";
import type { Categoria } from "./entities/Categoria";

export class CategoriaRepository {
    getCategorias = (): Promise<Categoria[]> => {
        return prisma.categoria.findMany();
    }
}