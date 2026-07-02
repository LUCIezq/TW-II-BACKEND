import { prisma } from "../../lib/prisma";

export class PedidosRepository {
    
 async crearPedido(datosPedido: any) {
        
        return await prisma.$transaction(async (tx) => {
            
            for (const item of datosPedido.items) {
                
                const producto = await tx.producto.findUnique({
                    where: { id: item.productoId }
                });
                if (!producto) {
                    throw new Error(`El producto ID ${item.productoId} no existe.`);
                }
                
                if (producto.stock < item.cantidad) {
                    throw new Error(`Sin stock suficiente para: ${producto.nombre}. Quedan ${producto.stock}`);
                }
                await tx.producto.update({
                    where: { id: item.productoId },
                    data: { stock: producto.stock - item.cantidad }
                });
            }
            const nuevoPedido = await tx.pedido.create({
                data: {
                    usuarioId: datosPedido.usuarioId,
                    total: datosPedido.total,
                    itemPedido: {
                        create: datosPedido.items
                    }
                }
            });
            return nuevoPedido;
        });
    }

    async obtenerPedidosPorUsuario(usuarioId: number) {
        return await prisma.pedido.findMany({
            where: {
                usuarioId: usuarioId
            },
            include: {
                itemPedido: {
                    include: {
                        producto: true
                    }
                }
            },
            orderBy: {
                fecha: 'desc' // Los más nuevos primero
            }
        });
}
  async obtenerPedidoPorId(pedidoId: number) {
        return await prisma.pedido.findUnique({
            where: {
                id: pedidoId
            },
            include: {
                itemPedido: {
                    include: {
                        producto: true
                    }
                }
            }
        });
    }

}