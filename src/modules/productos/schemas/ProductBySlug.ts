import * as z from 'zod';

export const ProductBySlugSchema = z.object({
    slug: z.string()
        .min(1, { message: "El slug no puede estar vacío" })
        .max(100, { message: "El slug no puede tener más de 100 caracteres" }),
}) 