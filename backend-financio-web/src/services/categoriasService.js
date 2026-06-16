import { supabase } from '../config/supabaseClient.js';

const seleccionarCategoria = `
    id,
    usuario_id,
    nombre,
    tipo,
    es_global,
    creado_en,
    actualizado_en
    `;

    const obtenerCategoriaVisible = async (
    usuarioId,
    categoriaId
    ) => {
    const { data: categoria, error } = await supabase
        .from('categorias')
        .select(seleccionarCategoria)
        .eq('id', categoriaId)
        .or(`es_global.eq.true,usuario_id.eq.${usuarioId}`)
        .maybeSingle();

    if (error) {
        throw new Error(
        'No fue posible obtener la categoría'
        );
    }

    if (!categoria) {
        const errorCategoria = new Error(
        'Categoría no encontrada'
        );
        errorCategoria.statusCode = 404;
        throw errorCategoria;
    }

    return categoria;
    };

    const obtenerCategoriaPropia = async (
    usuarioId,
    categoriaId
    ) => {
    const { data: categoria, error } = await supabase
        .from('categorias')
        .select(seleccionarCategoria)
        .eq('id', categoriaId)
        .eq('usuario_id', usuarioId)
        .maybeSingle();

    if (error) {
        throw new Error(
        'No fue posible obtener la categoría'
        );
    }

    if (!categoria) {
        const errorCategoria = new Error(
        'Categoría no encontrada o no editable'
        );
        errorCategoria.statusCode = 404;
        throw errorCategoria;
    }

    return categoria;
    };

    const validarNombreDuplicado = async ({
    usuarioId,
    nombre,
    tipo,
    categoriaId = null
    }) => {
    let consulta = supabase
        .from('categorias')
        .select('id')
        .eq('usuario_id', usuarioId)
        .ilike('nombre', nombre)
        .eq('tipo', tipo);

    if (categoriaId) {
        consulta = consulta.neq('id', categoriaId);
    }

    const { data, error } = await consulta;

    if (error) {
        throw new Error(
        'No fue posible validar la categoría'
        );
    }

    if (data.length > 0) {
        const errorDuplicado = new Error(
        'Ya existe una categoría personalizada con ese nombre y tipo'
        );
        errorDuplicado.statusCode = 409;
        throw errorDuplicado;
    }
    };

    export const listarCategoriasService = async (
    usuarioId,
    filtros
    ) => {
    const { tipo } = filtros;

    let consulta = supabase
        .from('categorias')
        .select(seleccionarCategoria)
        .or(`es_global.eq.true,usuario_id.eq.${usuarioId}`)
        .order('tipo', { ascending: true })
        .order('nombre', { ascending: true });

    if (tipo) {
        consulta = consulta.eq('tipo', tipo);
    }

    const { data, error } = await consulta;

    if (error) {
        throw new Error(
        'No fue posible obtener las categorías'
        );
    }

    return data;
    };

    export const obtenerCategoriaPorIdService = async (
    usuarioId,
    categoriaId
    ) => {
    return await obtenerCategoriaVisible(
        usuarioId,
        categoriaId
    );
    };

    export const crearCategoriaService = async (
    usuarioId,
    datos
    ) => {
    const nombre = datos.nombre.trim();
    const tipo = datos.tipo;

    await validarNombreDuplicado({
        usuarioId,
        nombre,
        tipo
    });

    const { data: categoria, error } = await supabase
        .from('categorias')
        .insert({
        usuario_id: usuarioId,
        nombre,
        tipo,
        es_global: false
        })
        .select(seleccionarCategoria)
        .single();

    if (error) {
        throw new Error(
        'No fue posible crear la categoría'
        );
    }

    return categoria;
    };

    export const actualizarCategoriaService = async (
    usuarioId,
    categoriaId,
    datos
    ) => {
    const categoriaActual =
        await obtenerCategoriaPropia(
        usuarioId,
        categoriaId
        );

    const nombre = datos.nombre.trim();
    const tipo = datos.tipo;

    if (categoriaActual.es_global) {
        const error = new Error(
        'Las categorías globales no se pueden modificar'
        );
        error.statusCode = 403;
        throw error;
    }

    await validarNombreDuplicado({
        usuarioId,
        nombre,
        tipo,
        categoriaId
    });

    if (categoriaActual.tipo !== tipo) {
        const {
        data: movimientosAsociados,
        error: errorMovimientos
        } = await supabase
        .from('movimientos')
        .select('id')
        .eq('categoria_id', categoriaId)
        .eq('usuario_id', usuarioId)
        .limit(1);

        if (errorMovimientos) {
        throw new Error(
            'No fue posible validar los movimientos asociados'
        );
        }

        if (movimientosAsociados.length > 0) {
        const error = new Error(
            'No puedes cambiar el tipo de una categoría que ya tiene movimientos asociados'
        );
        error.statusCode = 400;
        throw error;
        }
    }

    const { data: categoria, error } = await supabase
        .from('categorias')
        .update({
        nombre,
        tipo
        })
        .eq('id', categoriaId)
        .eq('usuario_id', usuarioId)
        .select(seleccionarCategoria)
        .single();

    if (error) {
        throw new Error(
        'No fue posible actualizar la categoría'
        );
    }

    return categoria;
    };

    export const eliminarCategoriaService = async (
    usuarioId,
    categoriaId
    ) => {
    const categoria = await obtenerCategoriaPropia(
        usuarioId,
        categoriaId
    );

    if (categoria.es_global) {
        const error = new Error(
        'Las categorías globales no se pueden eliminar'
        );
        error.statusCode = 403;
        throw error;
    }

    const { data, error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', categoriaId)
        .eq('usuario_id', usuarioId)
        .select('id, nombre, tipo')
        .single();

    if (error) {
        throw new Error(
        'No fue posible eliminar la categoría'
        );
    }

    return data;
};