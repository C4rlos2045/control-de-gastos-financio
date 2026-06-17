import app from './app.js';
import {
    env,
    validarVariablesEntorno
    } from './config/env.js';

    validarVariablesEntorno();

    app.listen(env.port, '0.0.0.0', () => {
    console.log(
        `Servidor ejecutándose en http://localhost:${env.port}`
    );
});