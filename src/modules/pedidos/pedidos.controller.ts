import type { Request, Response } from "express";
import type { PedidosService } from "./pedidos.service";

export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) { }

    crear = async (req: Request, res: Response): Promise<void> => {
        try {
            const { usuarioId, items } = req.body;

            const nuevoPedido = await this.pedidosService.procesarCheckout(usuarioId, items);

            res.status(201).json({ mensaje: "Pedido creado con éxito", pedido: nuevoPedido });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Hubo un error al procesar el pedido" });
        }
    }

       obtenerHistorial = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const usuarioId = parseInt(req.params.id);
            
            const historial = await this.pedidosService.obtenerHistorial(usuarioId);
            
            res.status(200).json(historial);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener el historial" });
        }
    }

        obtenerDetalle = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const pedidoId = parseInt(req.params.id);
            
            const detalle = await this.pedidosService.obtenerDetalle(pedidoId);
            
            if (!detalle) {
                res.status(404).json({ error: "Pedido no encontrado" });
                return;
            }
            
            res.status(200).json(detalle);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener el detalle" });
        }
    }
}