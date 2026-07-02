import type { Request, Response } from 'express';
import { z } from 'zod';
import { EmailService } from '../email/email.service';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { TokenAccionRepository } from './token-accion.repository';

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
    rol: z.string().min(1),
});

const verificarEmailSchema = z.object({
    token: z.string().min(1),
});

const forgotPasswordSchema = z.object({
    email: z.email(),
});

const resetPasswordSchema = z.object({
    token: z.string().min(1),
    password: passwordSchema,
});

export class AuthController {
    private authService: AuthService;

    constructor() {
        const authRepository = new AuthRepository();
        const tokenAccionRepository = new TokenAccionRepository();
        const emailService = new EmailService();
        this.authService = new AuthService(authRepository, tokenAccionRepository, emailService);
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
            if (error instanceof Error && error.message === 'EMAIL_NO_VERIFICADO') {
                res.status(403).json({ error: 'EMAIL_NO_VERIFICADO' });
                return;
            }
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

    verificarEmail = async (req: Request, res: Response): Promise<void> => {
        const result = verificarEmailSchema.safeParse(req.query);
        if (!result.success) {
            res.status(400).json({ error: 'Token inválido' });
            return;
        }

        try {
            await this.authService.verifyEmail(result.data.token);
            res.json({ message: 'Email verificado correctamente' });
        } catch (error) {
            if (error instanceof Error && error.message === 'TOKEN_EXPIRADO') {
                res.status(410).json({ error: 'El link expiró, pedí uno nuevo' });
                return;
            }
            if (error instanceof Error && error.message === 'TOKEN_INVALIDO') {
                res.status(400).json({ error: 'Token inválido' });
                return;
            }
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    resendVerification = async (req: Request, res: Response): Promise<void> => {
        const result = forgotPasswordSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten() });
            return;
        }

        try {
            await this.authService.resendVerification(result.data.email);
        } catch (error) {
            console.error(error);
        }

        res.json({ message: 'Si el email está registrado y pendiente de verificación, te enviamos un nuevo link' });
    };

    forgotPassword = async (req: Request, res: Response): Promise<void> => {
        const result = forgotPasswordSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten() });
            return;
        }

        try {
            await this.authService.requestPasswordReset(result.data.email);
        } catch (error) {
            console.error(error);
        }

        // Misma respuesta exista o no el email, para no filtrar qué emails están registrados.
        res.json({ message: 'Si el email está registrado, te enviamos instrucciones para recuperar tu contraseña' });
    };

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        const result = resetPasswordSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten() });
            return;
        }

        try {
            await this.authService.resetPassword(result.data.token, result.data.password);
            res.json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            if (error instanceof Error && error.message === 'TOKEN_EXPIRADO') {
                res.status(410).json({ error: 'El link expiró, pedí uno nuevo' });
                return;
            }
            if (error instanceof Error && error.message === 'TOKEN_INVALIDO') {
                res.status(400).json({ error: 'Token inválido' });
                return;
            }
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}
