import { Router } from "express";
import { ProductosController } from "./productos.controller";
import { ProductosService } from "./productos.service";
import { ProductosRepository } from "./productos.repository";

const productosRouter = Router();
const productosRepository = new ProductosRepository();
const productosService = new ProductosService(productosRepository);
const productosController = new ProductosController(productosService);

productosRouter.get("/", productosController.getAll);
productosRouter.get("/:slug", productosController.getProductBySlug);

export default productosRouter;