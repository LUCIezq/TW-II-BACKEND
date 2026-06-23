import { Router } from 'express';
import { AuthController } from './auth.controller';

const authController = new AuthController();

export const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.get('/verificar', authController.verificarEmail);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);
