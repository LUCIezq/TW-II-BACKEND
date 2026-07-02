import { Router } from "express";
import { PedidosRepository } from "./pedidos.repository";
import { PedidosService } from "./pedidos.service";
import { PedidosController } from "./pedidos.controller";

export const pedidosRouter = Router();

const repository = new PedidosRepository();
const service = new PedidosService(repository);
const controller = new PedidosController(service);

pedidosRouter.post("/", controller.crear);
pedidosRouter.get("/usuario/:id", controller.obtenerHistorial);
pedidosRouter.get("/:id", controller.obtenerDetalle);