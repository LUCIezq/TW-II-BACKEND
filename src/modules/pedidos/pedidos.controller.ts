import type { Request, Response } from "express";
import { z } from "zod";
import type { PedidosService } from "./pedidos.service";

const itemCheckoutSchema = z.object({
    productoId: z.number().int().positive(),
    precio: z.number().positive(),
    cantidad: z.number().int().positive(),
});

const checkoutSchema = z.object({
    usuarioId: z.number().int().positive(),
    items: z.array(itemCheckoutSchema).min(1),
});

export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) { }

    crear = async (req: Request, res: Response): Promise<void> => {
        const result = checkoutSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten() });
            return;
        }

        try {
            const nuevoPedido = await this.pedidosService.procesarCheckout(
                result.data.usuarioId,
                result.data.items,
            );
            res.status(201).json({ message: 'Pedido creado con éxito', pedido: nuevoPedido });
        } catch (error) {
            if (error instanceof Error && error.message === 'PRODUCTO_NO_ENCONTRADO') {
                res.status(422).json({ error: 'Uno o más productos no están disponibles' });
                return;
            }
            if (error instanceof Error && error.message === 'SIN_STOCK') {
                res.status(422).json({ error: 'Stock insuficiente para uno o más productos' });
                return;
            }
            console.error(error);
            res.status(500).json({ error: 'Error al procesar el pedido' });
        }
    }

    obtenerHistorial = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const usuarioId = parseInt(req.params.id);
            const historial = await this.pedidosService.obtenerHistorial(usuarioId);
            res.status(200).json(historial);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el historial' });
        }
    }

    obtenerDetalle = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const pedidoId = parseInt(req.params.id);
            const detalle = await this.pedidosService.obtenerDetalle(pedidoId);

            if (!detalle) {
                res.status(404).json({ error: 'Pedido no encontrado' });
                return;
            }

            res.status(200).json(detalle);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el detalle del pedido' });
        }
    }
}
