import type { Request, Response } from "express";
import type { CategoriaService } from "./categoria.service";

export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) { }

    getCategorias = async (_req: Request, res: Response): Promise<void> => {
        try {
            const categorias = await this.categoriaService.getCategorias();
            res.status(200).json(categorias);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las categorías' });
        }
    }
}
