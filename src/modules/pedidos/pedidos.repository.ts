import { prisma } from "../../lib/prisma";

type ItemPedidoInput = {
    productoId: number;
    precioUnitario: number;
    cantidad: number;
};

export class PedidosRepository {

    buscarProductoPorId(id: number) {
        return prisma.producto.findUnique({ where: { id } });
    }

    async insertarPedidoConItems(usuarioId: number, total: number, items: ItemPedidoInput[]) {
        return prisma.$transaction(async (tx) => {
            for (const item of items) {
                await tx.producto.update({
                    where: { id: item.productoId },
                    data: { stock: { decrement: item.cantidad } },
                });
            }
            return tx.pedido.create({
                data: {
                    usuarioId,
                    total,
                    itemPedido: { create: items },
                },
            });
        });
    }

    async obtenerPedidosPorUsuario(usuarioId: number) {
        return prisma.pedido.findMany({
            where: { usuarioId },
            include: {
                itemPedido: {
                    include: { producto: true },
                },
            },
            orderBy: { fecha: 'desc' },
        });
    }

    async obtenerPedidoPorId(pedidoId: number) {
        return prisma.pedido.findUnique({
            where: { id: pedidoId },
            include: {
                itemPedido: {
                    include: { producto: true },
                },
            },
        });
    }
}
