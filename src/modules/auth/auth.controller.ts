import type { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from './auth.service';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const authController = {
    login: async (req: Request, res: Response): Promise<void> => {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten() });
            return;
        }

        try {
            const data = await authService.login(result.data.email, result.data.password);
            res.json(data);
        } catch {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    },
};
