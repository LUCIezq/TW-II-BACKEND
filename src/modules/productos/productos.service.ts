import type { ProductoDetail } from "./DTOs/ProductoDetail";
import type { ProductosRepository } from "./productos.repository";
import { ProductoMapper } from "./productos.mapper";

export class ProductosService {
    constructor(private readonly productosRepository: ProductosRepository) { }

    async getAll(): Promise<ProductoDetail[]> {
        const productos = await this.productosRepository.getAll();
        return productos.map(p => ProductoMapper.toDetail(p));
    }
}