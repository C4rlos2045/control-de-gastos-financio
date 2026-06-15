import app from './app.js';
import {
    env,
    validarVariablesEntorno
    } from './config/env.js';

    validarVariablesEntorno();

    app.listen(env.port, () => {
    console.log(
        `Servidor ejecutándose en http://localhost:${env.port}`
    );
});