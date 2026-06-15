import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { authRepository } from './auth.repository';

export const authService = {
    login: async (email: string, password: string) => {
        const user = await authRepository.findByEmail(email);
        if (!user) throw new Error('Credenciales inválidas');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error('Credenciales inválidas');

        const { password: _pw, ...userWithoutPassword } = user;

        const token = jwt.sign(
            {
                sub: user.id,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
                direccion: user.direccion,
            },
            ENV.JWT.SECRET,
            { expiresIn: ENV.JWT.EXPIRES_IN },
        );

        return { token, user: userWithoutPassword };
    },
};
