import { supabase } from '../config/supabaseClient.js';
import {
    hashearPassword,
    compararPassword
    } from '../utils/password.js';
    import { generarToken } from '../utils/jwt.js';

    const seleccionarUsuarioPublico =
    'id, nombre, correo, rol, activo, creado_en';

    export const registrarUsuarioService = async ({
    nombre,
    correo,
    password
    }) => {
    const { data: usuariosExistentes, error: errorBusqueda } =
        await supabase
        .from('usuarios')
        .select('id')
        .eq('correo', correo)
        .limit(1);

    if (errorBusqueda) {
        throw new Error(
        'Error al verificar el correo del usuario'
        );
    }

    if (usuariosExistentes.length > 0) {
        const error = new Error(
        'El correo ya se encuentra registrado'
        );
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await hashearPassword(password);

    const {
        data: usuarioCreado,
        error: errorUsuario
    } = await supabase
        .from('usuarios')
        .insert({
        nombre,
        correo,
        password_hash: passwordHash
        })
        .select(seleccionarUsuarioPublico)
        .single();

    if (errorUsuario) {
        throw new Error(
        'No fue posible registrar el usuario'
        );
    }

    const { error: errorPerfil } = await supabase
        .from('perfiles')
        .insert({
        usuario_id: usuarioCreado.id
        });

    if (errorPerfil) {
        await supabase
        .from('usuarios')
        .delete()
        .eq('id', usuarioCreado.id);

        throw new Error(
        'No fue posible crear el perfil del usuario'
        );
    }

    const token = generarToken(usuarioCreado);

    return {
        usuario: usuarioCreado,
        token
    };
    };

    export const loginUsuarioService = async ({
    correo,
    password
    }) => {
    const { data: usuario, error } = await supabase
        .from('usuarios')
        .select(
        'id, nombre, correo, password_hash, rol, activo, creado_en'
        )
        .eq('correo', correo)
        .single();

    if (error || !usuario) {
        const errorLogin = new Error(
        'Correo o contraseña incorrectos'
        );
        errorLogin.statusCode = 401;
        throw errorLogin;
    }

    if (!usuario.activo) {
        const errorActivo = new Error(
        'La cuenta se encuentra desactivada'
        );
        errorActivo.statusCode = 403;
        throw errorActivo;
    }

    const passwordValido = await compararPassword(
        password,
        usuario.password_hash
    );

    if (!passwordValido) {
        const errorPassword = new Error(
        'Correo o contraseña incorrectos'
        );
        errorPassword.statusCode = 401;
        throw errorPassword;
    }

    const usuarioPublico = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        activo: usuario.activo,
        creado_en: usuario.creado_en
    };

    const token = generarToken(usuarioPublico);

    return {
        usuario: usuarioPublico,
        token
    };
    };

    export const obtenerSesionService = async (
    usuarioId
    ) => {
    const { data: usuario, error: errorUsuario } =
        await supabase
        .from('usuarios')
        .select(seleccionarUsuarioPublico)
        .eq('id', usuarioId)
        .single();

    if (errorUsuario || !usuario) {
        const error = new Error(
        'Usuario no encontrado'
        );
        error.statusCode = 404;
        throw error;
    }

    const { data: perfil, error: errorPerfil } =
        await supabase
        .from('perfiles')
        .select(
            'telefono, direccion, curp, rfc, avatar_url'
        )
        .eq('usuario_id', usuarioId)
        .single();

    if (errorPerfil && errorPerfil.code !== 'PGRST116') {
        throw new Error(
        'No fue posible obtener el perfil del usuario'
        );
    }

    return {
        ...usuario,
        perfil: perfil || null
    };
};