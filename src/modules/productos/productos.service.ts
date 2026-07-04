import type { ProductoDetail } from "./DTOs/ProductoDetail";
import type { ProductosRepository } from "./productos.repository";
import { ProductoMapper } from "./productos.mapper";
import type { Producto } from "./entities/ProductoEntity";
import type ProductFilter from "./interfaces/ProductFilter";

function generarSlug(texto: string): string {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

export class ProductosService {
    constructor(private readonly productosRepository: ProductosRepository) { }

    async getAll(filters: ProductFilter): Promise<ProductoDetail[]> {
        const productos = await this.productosRepository.getAll(filters);
        return productos.map(p => ProductoMapper.toDetail(p));
    }

    async getProductBySlug(slug: string): Promise<Producto | null> {
        const product = await this.productosRepository.getProductBySlug(slug);
        return product;
    }

    async crearProducto(datos: any) {
        const baseSlug = generarSlug(datos.nombre);
        const existe = await this.productosRepository.getProductBySlug(baseSlug);
        const slug = existe
            ? `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
            : baseSlug;

        return this.productosRepository.crearProducto({ ...datos, slug });
    }

    async actualizarProducto(id: number, datos: any) {
        return await this.productosRepository.actualizarProducto(id, datos);
    }

    async eliminarProducto(id: number) {
        return await this.productosRepository.eliminarProducto(id);
    }
}
