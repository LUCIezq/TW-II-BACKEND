import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { TipoTokenAccion } from '../../generated/prisma/client';
import type { EmailService } from '../email/email.service';
import type { AuthRepository } from './auth.repository';
import type { TokenAccionRepository } from './token-accion.repository';

const SIETE_DIAS_EN_SEGUNDOS = 60 * 60 * 24 * 7;
const VERIFICACION_EXPIRA_MS = 24 * 60 * 60 * 1000;
const RESET_PASSWORD_EXPIRA_MS = 60 * 60 * 1000;

export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private tokenAccionRepository: TokenAccionRepository,
        private emailService: EmailService,
    ) {}

    private signToken(user: { id: number; email: string; nombre: string; apellido: string; direccion: string; rol: string }) {
        return jwt.sign(
            { sub: user.id, email: user.email, nombre: user.nombre, apellido: user.apellido, direccion: user.direccion, rol: user.rol },
            ENV.JWT.SECRET,
            { expiresIn: SIETE_DIAS_EN_SEGUNDOS },
        );
    }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    // Invalida cualquier token pendiente del mismo tipo antes de emitir uno nuevo,
    // así no quedan varios links "vivos" para la misma acción.
    private async generarTokenAccion(usuarioId: number, tipo: TipoTokenAccion, expiraEnMs: number): Promise<string> {
        await this.tokenAccionRepository.invalidatePending(usuarioId, tipo);

        const token = crypto.randomBytes(32).toString('hex');
        await this.tokenAccionRepository.create({
            usuarioId,
            tokenHash: this.hashToken(token),
            tipo,
            expiraEn: new Date(Date.now() + expiraEnMs),
        });

        return token;
    }

    async login(email: string, password: string) {
        const user = await this.authRepository.findByEmail(email);
        if (!user) throw new Error('Credenciales inválidas');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error('Credenciales inválidas');

        if (!user.emailVerificado) throw new Error('EMAIL_NO_VERIFICADO');

        const { password: _pw, ...userWithoutPassword } = user;
        return { token: this.signToken(user), user: userWithoutPassword };
    }

    async register(data: { email: string; password: string; nombre: string; apellido: string; direccion: string }) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        let user;
        try {
            user = await this.authRepository.create({ ...data, password: hashedPassword });
        } catch (error) {
            // P2002 = violación de constraint unique (email duplicado)
            if (this.isPrismaUniqueError(error)) throw new Error('EMAIL_TAKEN');
            throw error;
        }

        const token = await this.generarTokenAccion(user.id, TipoTokenAccion.VERIFICACION_EMAIL, VERIFICACION_EXPIRA_MS);
        await this.emailService.enviarVerificacionEmail(user.email, token);

        // No se devuelve token de sesión: la cuenta queda sin verificar hasta
        // que el usuario haga clic en el link del email.
        const { password: _pw, ...userWithoutPassword } = user;
        return { user: userWithoutPassword };
    }

    async verifyEmail(token: string): Promise<void> {
        const tokenAccion = await this.tokenAccionRepository.findByHash(this.hashToken(token));

        if (!tokenAccion || tokenAccion.tipo !== TipoTokenAccion.VERIFICACION_EMAIL || tokenAccion.usado) {
            throw new Error('TOKEN_INVALIDO');
        }
        if (tokenAccion.expiraEn < new Date()) throw new Error('TOKEN_EXPIRADO');

        await this.tokenAccionRepository.markAsUsed(tokenAccion.id);
        await this.authRepository.markEmailAsVerified(tokenAccion.usuarioId);
    }

    async resendVerification(email: string): Promise<void> {
        const user = await this.authRepository.findByEmail(email);
        if (!user || user.emailVerificado) return;

        const token = await this.generarTokenAccion(user.id, TipoTokenAccion.VERIFICACION_EMAIL, VERIFICACION_EXPIRA_MS);
        await this.emailService.enviarVerificacionEmail(user.email, token);
    }

    async requestPasswordReset(email: string): Promise<void> {
        const user = await this.authRepository.findByEmail(email);
        // Si el email no existe, no se hace nada — el controller responde 200
        // igual en ambos casos para no filtrar qué emails están registrados.
        if (!user) return;

        const token = await this.generarTokenAccion(user.id, TipoTokenAccion.RESET_PASSWORD, RESET_PASSWORD_EXPIRA_MS);
        await this.emailService.enviarResetPassword(user.email, token);
    }

    async resetPassword(token: string, nuevaPassword: string): Promise<void> {
        const tokenAccion = await this.tokenAccionRepository.findByHash(this.hashToken(token));

        if (!tokenAccion || tokenAccion.tipo !== TipoTokenAccion.RESET_PASSWORD || tokenAccion.usado) {
            throw new Error('TOKEN_INVALIDO');
        }
        if (tokenAccion.expiraEn < new Date()) throw new Error('TOKEN_EXPIRADO');

        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
        await this.tokenAccionRepository.markAsUsed(tokenAccion.id);
        await this.authRepository.updatePassword(tokenAccion.usuarioId, hashedPassword);
    }

    private isPrismaUniqueError(error: unknown): boolean {
        return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code: string }).code === 'P2002'
        );
    }
}
