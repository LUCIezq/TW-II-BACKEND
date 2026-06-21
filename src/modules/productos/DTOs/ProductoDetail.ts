import type { CategoriaDetail } from "../../categorias/DTOs/CategoriaDetail";

export interface ProductoDetail {
    id: number,
    nombre: string,
    slug: string,
    descripcion: string,
    precio: number,
    stock: number,
    imagenUrl: string,
    categoria: CategoriaDetail
}