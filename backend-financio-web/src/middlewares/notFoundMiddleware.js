export const notFoundMiddleware = (req, res) => {
    return res.status(404).json({
        ok: false,
        mensaje: 'Ruta no encontrada'
    });
};