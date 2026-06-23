import type { Request, Response } from 'express';
import { z } from 'zod';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

// Reglas del TP: complejidad de contraseña requerida
const passwordSchema = z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número');

const registerSchema = z.object({
    email: z.email(),
    password: passwordSchema,
    nombre: z.string().min(1),
    apellido: z.string().min(1),
    direccion: z.string().min(1),
});

export class AuthController {
    private authService: AuthService;

    constructor() {
        const authRepository = new AuthRepository();
        this.authService = new AuthService(authRepository);
    }

    login = async (req: Request, res: Response): Promise<void> => {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten() });
            return;
        }

        try {
            const data = await this.authService.login(result.data.email, result.data.password);
            res.json(data);
        } catch (error) {
            // Se loguea server-side, pero al cliente siempre se le responde lo mismo
            // (no hay que filtrar si fue error de DB o credenciales inválidas)
            console.error(error);
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    };

    register = async (req: Request, res: Response): Promise<void> => {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten() });
            return;
        }

        try {
            const data = await this.authService.register(result.data);
            res.status(201).json(data);
        } catch (error) {
            if (error instanceof Error && error.message === 'EMAIL_TAKEN') {
                res.status(409).json({ error: 'El email ya está registrado' });
                return;
            }
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}
