import { supabase } from '../config/supabaseClient.js';

const seleccionarMovimiento = `
    id,
    usuario_id,
    categoria_id,
    tipo,
    descripcion,
    monto,
    fecha,
    creado_en,
    actualizado_en,
    categorias (
        id,
        nombre,
        tipo,
        es_global
    )
    `;

    const validarCategoria = async (
    categoriaId,
    usuarioId,
    tipoMovimiento
    ) => {
    const { data: categoria, error } = await supabase
        .from('categorias')
        .select('id, nombre, tipo, usuario_id, es_global')
        .eq('id', categoriaId)
        .maybeSingle();

    if (error) {
        throw new Error(
        'No fue posible validar la categoría'
        );
    }

    if (!categoria) {
        const errorCategoria = new Error(
        'La categoría no existe'
        );
        errorCategoria.statusCode = 404;
        throw errorCategoria;
    }

    const categoriaPermitida =
        categoria.es_global === true ||
        categoria.usuario_id === usuarioId;

    if (!categoriaPermitida) {
        const errorPermiso = new Error(
        'No tienes permiso para usar esta categoría'
        );
        errorPermiso.statusCode = 403;
        throw errorPermiso;
    }

    if (categoria.tipo !== tipoMovimiento) {
        const errorTipo = new Error(
        'La categoría no corresponde al tipo de movimiento'
        );
        errorTipo.statusCode = 400;
        throw errorTipo;
    }

    return categoria;
    };

    export const listarMovimientosService = async (
    usuarioId,
    filtros
    ) => {
    const {
        tipo,
        categoria_id,
        fecha_inicio,
        fecha_fin
    } = filtros;

    let consulta = supabase
        .from('movimientos')
        .select(seleccionarMovimiento)
        .eq('usuario_id', usuarioId)
        .order('fecha', { ascending: false })
        .order('creado_en', { ascending: false });

    if (tipo) {
        consulta = consulta.eq('tipo', tipo);
    }

    if (categoria_id) {
        consulta = consulta.eq('categoria_id', categoria_id);
    }

    if (fecha_inicio) {
        consulta = consulta.gte('fecha', fecha_inicio);
    }

    if (fecha_fin) {
        consulta = consulta.lte('fecha', fecha_fin);
    }

    const { data, error } = await consulta;

    if (error) {
        throw new Error(
        'No fue posible obtener los movimientos'
        );
    }

    return data;
    };

    export const obtenerMovimientoPorIdService = async (
    usuarioId,
    movimientoId
    ) => {
    const { data: movimiento, error } = await supabase
        .from('movimientos')
        .select(seleccionarMovimiento)
        .eq('id', movimientoId)
        .eq('usuario_id', usuarioId)
        .maybeSingle();

    if (error) {
        throw new Error(
        'No fue posible obtener el movimiento'
        );
    }

    if (!movimiento) {
        const errorMovimiento = new Error(
        'Movimiento no encontrado'
        );
        errorMovimiento.statusCode = 404;
        throw errorMovimiento;
    }

    return movimiento;
    };

    export const crearMovimientoService = async (
    usuarioId,
    datos
    ) => {
    const {
        categoria_id,
        tipo,
        descripcion,
        monto,
        fecha
    } = datos;

    await validarCategoria(
        categoria_id,
        usuarioId,
        tipo
    );

    const { data: movimiento, error } = await supabase
        .from('movimientos')
        .insert({
        usuario_id: usuarioId,
        categoria_id,
        tipo,
        descripcion: descripcion.trim(),
        monto: Number(monto),
        fecha
        })
        .select(seleccionarMovimiento)
        .single();

    if (error) {
        throw new Error(
        'No fue posible crear el movimiento'
        );
    }

    return movimiento;
    };

    export const actualizarMovimientoService = async (
    usuarioId,
    movimientoId,
    datos
    ) => {
    const {
        categoria_id,
        tipo,
        descripcion,
        monto,
        fecha
    } = datos;

    await obtenerMovimientoPorIdService(
        usuarioId,
        movimientoId
    );

    await validarCategoria(
        categoria_id,
        usuarioId,
        tipo
    );

    const { data: movimiento, error } = await supabase
        .from('movimientos')
        .update({
        categoria_id,
        tipo,
        descripcion: descripcion.trim(),
        monto: Number(monto),
        fecha
        })
        .eq('id', movimientoId)
        .eq('usuario_id', usuarioId)
        .select(seleccionarMovimiento)
        .single();

    if (error) {
        throw new Error(
        'No fue posible actualizar el movimiento'
        );
    }

    return movimiento;
    };

    export const eliminarMovimientoService = async (
    usuarioId,
    movimientoId
    ) => {
    const movimientoExistente =
        await obtenerMovimientoPorIdService(
        usuarioId,
        movimientoId
        );

    const { data, error } = await supabase
        .from('movimientos')
        .delete()
        .eq('id', movimientoId)
        .eq('usuario_id', usuarioId)
        .select('id')
        .single();

    if (error) {
        throw new Error(
        'No fue posible eliminar el movimiento'
        );
    }

    return {
        id: data.id,
        movimiento: movimientoExistente
    };
};