import { Router } from 'express';
import { AuthController } from './auth.controller';

const authController = new AuthController();

export const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
