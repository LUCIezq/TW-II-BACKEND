import type { ProductoDetail } from "./DTOs/ProductoDetail";
import type { Producto } from "./entities/ProductoEntity";

export const ProductoMapper = {
    toDetail: (producto: Producto): ProductoDetail => ({
        id: producto.id,
        nombre: producto.nombre,
        slug: producto.slug,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        imagenUrl: producto.imagenUrl,
        categoria: producto.categoria
    })
}
