import { PedidosRepository } from "./pedidos.repository";

export class PedidosService {
    constructor(private readonly pedidosRepository: PedidosRepository) { }

    async procesarCheckout(usuarioId: number, carrito: any[]) {
        
        let total = 0;
        for (const item of carrito) {
            total += item.precio * item.cantidad;
        }

        const datosPedido = {
            usuarioId: usuarioId,
            total: total,
            items: carrito.map(item => ({
                productoId: item.productoId,
                precioUnitario: item.precio,
                cantidad: item.cantidad
            }))
        };

        return await this.pedidosRepository.crearPedido(datosPedido);
    }
     async obtenerHistorial(usuarioId: number) {
        return await this.pedidosRepository.obtenerPedidosPorUsuario(usuarioId);
    }
        async obtenerDetalle(pedidoId: number) {
        return await this.pedidosRepository.obtenerPedidoPorId(pedidoId);
    }
}