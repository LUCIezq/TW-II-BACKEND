import type { ProductoDetail } from "./DTOs/ProductoDetail";
import type { ProductosRepository } from "./productos.repository";
import { ProductoMapper } from "./productos.mapper";
import type { Producto } from "./entities/ProductoEntity";

export class ProductosService {
    constructor(private readonly productosRepository: ProductosRepository) { }

    async getAll(categoria?: string): Promise<ProductoDetail[]> {
        const productos = await this.productosRepository.getAll(categoria);
        return productos.map(p => ProductoMapper.toDetail(p));
    }


    async getProductBySlug(slug: string): Promise<Producto | null> {
        const product = await this.productosRepository.getProductBySlug(slug);
        return product;
    }

        async crearProducto(datos: any) {
        return await this.productosRepository.crearProducto(datos);
    }

    async actualizarProducto(id: number, datos: any) {
        return await this.productosRepository.actualizarProducto(id, datos);
    }

    async eliminarProducto(id: number) {
        return await this.productosRepository.eliminarProducto(id);
    }
}