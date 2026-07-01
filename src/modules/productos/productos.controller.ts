import type { Request, Response } from "express";
import type { ProductosService } from "./productos.service";
import { ProductBySlugSchema } from "./schemas/ProductBySlug";

export class ProductosController {

    public constructor(private readonly productosService: ProductosService) { }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const categoria = req.query.categoria as string | undefined;
        const productos = await this.productosService.getAll(categoria);
        res.status(200).json(productos);
    }

    getProductBySlug = async (req: Request, res: Response): Promise<void> => {
        const result = ProductBySlugSchema.safeParse(req.params);

        if (!result.success) {
            res.status(400).json({ message: "Parametros invalidos", errors: result.error });
            return;
        }

        const { slug } = result.data;
        const product = await this.productosService.getProductBySlug(slug);

        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }

        res.status(200).json(product);
    }
}