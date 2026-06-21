import type { Request, Response } from "express";
import type { ProductosService } from "./productos.service";

export class ProductosController {

    public constructor(private readonly productosService: ProductosService) { }

    getAll = async (_req: Request, res: Response): Promise<void> => {
        res.status(200).json(await this.productosService.getAll());
    }
}