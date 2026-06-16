import { supabase } from '../config/supabaseClient.js';
import { env } from '../config/env.js';
import {
    hashearPassword,
    compararPassword
    } from '../utils/password.js';

    const seleccionarUsuarioPublico =
    'id, nombre, correo, rol, activo, creado_en, actualizado_en';

    export const obtenerPerfilService = async (
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
            'telefono, direccion, curp, rfc, avatar_url, creado_en, actualizado_en'
        )
        .eq('usuario_id', usuarioId)
        .single();

    if (errorPerfil && errorPerfil.code !== 'PGRST116') {
        throw new Error(
        'No fue posible obtener el perfil'
        );
    }

    return {
        ...usuario,
        perfil: perfil || {
        telefono: null,
        direccion: null,
        curp: null,
        rfc: null,
        avatar_url: null
        }
    };
    };

    export const actualizarPerfilService = async (
    usuarioId,
    datos
    ) => {
    const {
        nombre,
        correo,
        telefono,
        direccion,
        curp,
        rfc,
        avatar_url
    } = datos;

    const {
        data: usuarioCorreo,
        error: errorCorreo
    } = await supabase
        .from('usuarios')
        .select('id')
        .eq('correo', correo)
        .neq('id', usuarioId)
        .maybeSingle();

    if (errorCorreo) {
        throw new Error(
        'No fue posible validar el correo'
        );
    }

    if (usuarioCorreo) {
        const error = new Error(
        'El correo ya pertenece a otro usuario'
        );
        error.statusCode = 409;
        throw error;
    }

    const {
        data: usuarioActualizado,
        error: errorUsuario
    } = await supabase
        .from('usuarios')
        .update({
        nombre,
        correo
        })
        .eq('id', usuarioId)
        .select(seleccionarUsuarioPublico)
        .single();

    if (errorUsuario) {
        throw new Error(
        'No fue posible actualizar los datos del usuario'
        );
    }

    const {
        data: perfilExistente,
        error: errorBusquedaPerfil
    } = await supabase
        .from('perfiles')
        .select('id')
        .eq('usuario_id', usuarioId)
        .maybeSingle();

    if (errorBusquedaPerfil) {
        throw new Error(
        'No fue posible verificar el perfil'
        );
    }

    const datosPerfil = {
        telefono: telefono || null,
        direccion: direccion || null,
        curp: curp
        ? curp.toUpperCase()
        : null,
        rfc: rfc
        ? rfc.toUpperCase()
        : null,
        avatar_url: avatar_url || null
    };

    let perfilActualizado;

    if (perfilExistente) {
        const { data, error } = await supabase
        .from('perfiles')
        .update(datosPerfil)
        .eq('usuario_id', usuarioId)
        .select(
            'telefono, direccion, curp, rfc, avatar_url, creado_en, actualizado_en'
        )
        .single();

        if (error) {
        throw new Error(
            'No fue posible actualizar el perfil'
        );
        }

        perfilActualizado = data;
    } else {
        const { data, error } = await supabase
        .from('perfiles')
        .insert({
            usuario_id: usuarioId,
            ...datosPerfil
        })
        .select(
            'telefono, direccion, curp, rfc, avatar_url, creado_en, actualizado_en'
        )
        .single();

        if (error) {
        throw new Error(
            'No fue posible crear el perfil'
        );
        }

        perfilActualizado = data;
    }

    return {
        ...usuarioActualizado,
        perfil: perfilActualizado
    };
    };

    export const actualizarAvatarService = async (
    usuarioId,
    archivo
    ) => {
    if (!archivo) {
        const error = new Error(
        'No se recibió ningún archivo'
        );
        error.statusCode = 400;
        throw error;
    }

    const { data: perfilActual } = await supabase
        .from('perfiles')
        .select('avatar_path')
        .eq('usuario_id', usuarioId)
        .maybeSingle();

    const extension =
        archivo.mimetype === 'image/png'
        ? 'png'
        : 'jpg';

    const rutaArchivo =
        `usuarios/${usuarioId}/avatar-${Date.now()}.${extension}`;

    const { error: errorUpload } =
        await supabase.storage
        .from(env.avatarBucket)
        .upload(
            rutaArchivo,
            archivo.buffer,
            {
            contentType: archivo.mimetype,
            cacheControl: '3600',
            upsert: false
            }
        );

    if (errorUpload) {
        throw new Error(
        'No fue posible subir el avatar'
        );
    }

    const { data: publicUrlData } =
        supabase.storage
        .from(env.avatarBucket)
        .getPublicUrl(rutaArchivo);

    const avatarUrl = publicUrlData.publicUrl;

    const { error: errorPerfil } = await supabase
        .from('perfiles')
        .upsert(
        {
            usuario_id: usuarioId,
            avatar_url: avatarUrl,
            avatar_path: rutaArchivo
        },
        {
            onConflict: 'usuario_id'
        }
        );

    if (errorPerfil) {
        await supabase.storage
        .from(env.avatarBucket)
        .remove([rutaArchivo]);

        throw new Error(
        'No fue posible actualizar el perfil con el avatar'
        );
    }

    if (
        perfilActual?.avatar_path &&
        perfilActual.avatar_path !== rutaArchivo
    ) {
        await supabase.storage
        .from(env.avatarBucket)
        .remove([perfilActual.avatar_path]);
    }

    return await obtenerPerfilService(usuarioId);
    };

    export const actualizarPasswordService = async (
    usuarioId,
    passwordActual,
    nuevaPassword
    ) => {
    const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('id, password_hash')
        .eq('id', usuarioId)
        .single();

    if (error || !usuario) {
        const errorUsuario = new Error(
        'Usuario no encontrado'
        );
        errorUsuario.statusCode = 404;
        throw errorUsuario;
    }

    const passwordValido = await compararPassword(
        passwordActual,
        usuario.password_hash
    );

    if (!passwordValido) {
        const errorPassword = new Error(
        'La contraseña actual no es correcta'
        );
        errorPassword.statusCode = 401;
        throw errorPassword;
    }

    const nuevoPasswordHash =
        await hashearPassword(nuevaPassword);

    const { error: errorActualizacion } =
        await supabase
        .from('usuarios')
        .update({
            password_hash: nuevoPasswordHash
        })
        .eq('id', usuarioId);

    if (errorActualizacion) {
        throw new Error(
        'No fue posible actualizar la contraseña'
        );
    }

    return {
        mensaje: 'Contraseña actualizada correctamente'
    };
};