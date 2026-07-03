import type { CategoriaDetail } from "./DTOs/CategoriaDetail";
import type { CategoriaRepository } from "./categoria.repository";
import { CategoriaMapper } from "./categoria.mapper";

export class CategoriaService {
    constructor(private readonly categoriaRepository: CategoriaRepository) { }

    async getCategorias(): Promise<CategoriaDetail[]> {
        const categorias = await this.categoriaRepository.getCategorias();
        return categorias.map(CategoriaMapper.toDetail);
    }
}
