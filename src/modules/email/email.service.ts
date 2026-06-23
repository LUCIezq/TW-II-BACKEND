import nodemailer from 'nodemailer';
import { ENV } from '../../config/env';

export class EmailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ENV.EMAIL.GMAIL_USER,
            pass: ENV.EMAIL.GMAIL_APP_PASSWORD,
        },
    });

    async enviarVerificacionEmail(destinatario: string, token: string): Promise<void> {
        const link = `${ENV.FRONTEND_URL}/auth/verificar?token=${token}`;

        await this.transporter.sendMail({
            from: ENV.EMAIL.GMAIL_USER,
            to: destinatario,
            subject: 'Verificá tu cuenta',
            html: `
                <p>¡Gracias por registrarte!</p>
                <p>Hacé clic en el siguiente link para verificar tu cuenta. Vence en 24 horas.</p>
                <p><a href="${link}">${link}</a></p>
            `,
        });
    }

    async enviarResetPassword(destinatario: string, token: string): Promise<void> {
        const link = `${ENV.FRONTEND_URL}/auth/reset-password?token=${token}`;

        await this.transporter.sendMail({
            from: ENV.EMAIL.GMAIL_USER,
            to: destinatario,
            subject: 'Recuperar contraseña',
            html: `
                <p>Recibimos un pedido para restablecer tu contraseña.</p>
                <p>Hacé clic en el siguiente link para elegir una nueva. Vence en 1 hora.</p>
                <p><a href="${link}">${link}</a></p>
                <p>Si no fuiste vos, podés ignorar este mensaje.</p>
            `,
        });
    }
}
