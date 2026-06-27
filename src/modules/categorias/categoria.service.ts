import type { Categoria } from "../../generated/prisma/browser";
import type { CategoriaRepository } from "./categoria.repository";

export class CategoriaService {
    constructor(private readonly categoriaRepository: CategoriaRepository) { }

    getCategorias = (): Promise<Categoria[]> => {
        return this.categoriaRepository.getCategorias();
    }
}