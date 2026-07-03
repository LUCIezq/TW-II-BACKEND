import type { UsuarioDTO } from './DTOs/UsuarioDTO';
import type { UsuarioEntity } from './entities/UsuarioEntity';

export const AuthMapper = {
    toDTO: (usuario: UsuarioEntity): UsuarioDTO => ({
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        direccion: usuario.direccion,
        rol: usuario.rol,
    }),
};
