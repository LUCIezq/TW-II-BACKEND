import type { CategoriaDetail } from './DTOs/CategoriaDetail';
import type { Categoria } from './entities/Categoria';

export const CategoriaMapper = {
    toDetail: (categoria: Categoria): CategoriaDetail => ({
        id: categoria.id,
        nombre: categoria.nombre,
        slug: categoria.slug,
        icono: categoria.icono,
    }),
};
