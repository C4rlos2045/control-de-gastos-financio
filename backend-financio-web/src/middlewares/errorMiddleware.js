export const errorMiddleware = (
    error,
    req,
    res,
    next
    ) => {
    console.error(error);

    return res.status(error.statusCode || 500).json({
        ok: false,
        mensaje:
        error.message ||
        'Error interno del servidor'
    });
};