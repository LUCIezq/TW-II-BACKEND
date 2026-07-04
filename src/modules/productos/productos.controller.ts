import type { Request, Response } from "express";
import type { ProductosService } from "./productos.service";
import { ProductBySlugSchema } from "./schemas/ProductBySlug";
import type ProductFilter from "./interfaces/ProductFilter";

export class ProductosController {

    public constructor(private readonly productosService: ProductosService) { }

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const filters: ProductFilter = {
                nombre: req.query.nombre as string,
                categoriaId: req.query.categoria as string,
            };
            const productos = await this.productosService.getAll(filters);
            res.status(200).json(productos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    }

    getProductBySlug = async (req: Request, res: Response): Promise<void> => {
        const result = ProductBySlugSchema.safeParse(req.params);

        if (!result.success) {
            res.status(400).json({ error: 'Parámetros inválidos' });
            return;
        }

        try {
            const product = await this.productosService.getProductBySlug(result.data.slug);

            if (!product) {
                res.status(404).json({ error: 'Producto no encontrado' });
                return;
            }

            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    }

    crear = async (req: Request, res: Response): Promise<void> => {
        try {
            const nuevoProducto = await this.productosService.crearProducto(req.body);
            res.status(201).json(nuevoProducto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    }

    actualizar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const productoActualizado = await this.productosService.actualizarProducto(id, req.body);
            res.status(200).json(productoActualizado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }

    eliminar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            await this.productosService.eliminarProducto(id);
            // 204 significa "No Content", es el código ideal cuando borramos algo con éxito
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }
}
