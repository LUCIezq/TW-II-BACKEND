import { Router } from "express";
import { CategoriaController } from "./categoria.controller";
import { CategoriaService } from "./categoria.service";
import { CategoriaRepository } from "./categoria.repository";

const categoriaRouter = Router();
const categoriaRepository = new CategoriaRepository();
const categoriaService = new CategoriaService(categoriaRepository);
const categoriaController = new CategoriaController(categoriaService);

categoriaRouter.get('/', categoriaController.getCategorias);

export default categoriaRouter;