import type { Request, Response } from "express";
import type { CategoriaService } from "./categoria.service";

export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) { }

    getCategorias = async (_req: Request, res: Response): Promise<void> => {
        res.status(200).json(await this.categoriaService.getCategorias());
    }
}