import rateLimit from 'express-rate-limit';

export const limitadorGeneral = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        ok: false,
        mensaje:
        'Demasiadas solicitudes. Intenta nuevamente más tarde.'
    }
    });

    export const limitadorAuth = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        ok: false,
        mensaje:
        'Demasiados intentos de autenticación. Intenta nuevamente en unos minutos.'
    }
});