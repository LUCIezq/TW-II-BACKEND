import type { Request, Response } from "express";
import type { ProductosService } from "./productos.service";
import { ProductBySlugSchema } from "./schemas/ProductBySlug";

export class ProductosController {

    public constructor(private readonly productosService: ProductosService) { }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const categoria = req.query.categoria as string | undefined;
        const productos = await this.productosService.getAll(categoria);
        res.status(200).json(productos);
    }

    getProductBySlug = async (req: Request, res: Response): Promise<void> => {
        const result = ProductBySlugSchema.safeParse(req.params);

        if (!result.success) {
            res.status(400).json({ message: "Parametros invalidos", errors: result.error });
            return;
        }

        const { slug } = result.data;
        const product = await this.productosService.getProductBySlug(slug);

        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }

        res.status(200).json(product);
    }

    crear = async (req: Request, res: Response): Promise<void> => {
        try {
            // Mandamos todo el JSON que nos envía Angular directo al servicio
            const nuevoProducto = await this.productosService.crearProducto(req.body);
            res.status(201).json(nuevoProducto); // 201: Created
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al crear el producto" });
        }
    }

    actualizar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const productoActualizado = await this.productosService.actualizarProducto(id, req.body);
            res.status(200).json(productoActualizado); // 200: OK
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar el producto" });
        }
    }

    eliminar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            await this.productosService.eliminarProducto(id);
            // 204 significa "No Content", es el código ideal cuando borramos algo con éxito
            res.status(204).send(); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar el producto" });
        }
    }
}