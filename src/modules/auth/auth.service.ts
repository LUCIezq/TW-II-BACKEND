import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { authRepository } from './auth.repository';

const SIETE_DIAS_EN_SEGUNDOS = 60 * 60 * 24 * 7;

const signToken = (user: { id: number; email: string; nombre: string; apellido: string; direccion: string }) =>
    jwt.sign(
        { sub: user.id, email: user.email, nombre: user.nombre, apellido: user.apellido, direccion: user.direccion },
        ENV.JWT.SECRET,
        { expiresIn: SIETE_DIAS_EN_SEGUNDOS },
    );

export const authService = {
    login: async (email: string, password: string) => {
        const user = await authRepository.findByEmail(email);
        if (!user) throw new Error('Credenciales inválidas');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error('Credenciales inválidas');

        const { password: _pw, ...userWithoutPassword } = user;
        return { token: signToken(user), user: userWithoutPassword };
    },

    register: async (data: {
        email: string;
        password: string;
        nombre: string;
        apellido: string;
        direccion: string;
    }) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        let user;
        try {
            user = await authRepository.create({ ...data, password: hashedPassword });
        } catch (error) {
            // P2002 = violación de constraint unique (email duplicado)
            if (isPrismaUniqueError(error)) throw new Error('EMAIL_TAKEN');
            throw error;
        }

        const { password: _pw, ...userWithoutPassword } = user;
        return { token: signToken(user), user: userWithoutPassword };
    },
};

const isPrismaUniqueError = (error: unknown): boolean =>
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2002';
