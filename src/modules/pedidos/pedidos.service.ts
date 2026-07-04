import { PedidosRepository } from "./pedidos.repository";

type ItemCarrito = {
    productoId: number;
    precio: number;
    cantidad: number;
};

export class PedidosService {
    constructor(private readonly pedidosRepository: PedidosRepository) { }

    async procesarCheckout(usuarioId: number, carrito: ItemCarrito[]) {
        for (const item of carrito) {
            const producto = await this.pedidosRepository.buscarProductoPorId(item.productoId);

            if (!producto) throw new Error('PRODUCTO_NO_ENCONTRADO');
            if (producto.stock < item.cantidad) throw new Error('SIN_STOCK');
        }

        const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        const items = carrito.map(item => ({
            productoId: item.productoId,
            precioUnitario: item.precio,
            cantidad: item.cantidad,
        }));

        return this.pedidosRepository.insertarPedidoConItems(usuarioId, total, items);
    }

    async obtenerHistorial(usuarioId: number) {
        return this.pedidosRepository.obtenerPedidosPorUsuario(usuarioId);
    }

    async obtenerDetalle(pedidoId: number) {
        return this.pedidosRepository.obtenerPedidoPorId(pedidoId);
    }
}
