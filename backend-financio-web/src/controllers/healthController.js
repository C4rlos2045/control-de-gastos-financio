import { supabase } from '../config/supabaseClient.js';

export const verificarServidor = async (req, res, next) => {
    try {
        const { error } = await supabase
        .from('categorias')
        .select('id')
        .limit(1);

        if (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Servidor activo, pero falló la conexión con Supabase',
            error: error.message
        });
        }

        return res.json({
        ok: true,
        mensaje: 'Backend funcionando correctamente',
        baseDatos: 'Conectada',
        fecha: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
};