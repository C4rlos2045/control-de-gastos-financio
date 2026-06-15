import { env } from '../config/env.js';

export const errorMiddleware = (
    error,
    req,
    res,
    next
    ) => {
    console.error(error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        ok: false,
        mensaje:
        error.message ||
        'Error interno del servidor',
        ...(env.nodeEnv === 'development' && {
        stack: error.stack
        })
    });
};