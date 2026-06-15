import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

export const hashearPassword = async (password) => {
    return await bcrypt.hash(
        password,
        env.bcryptSaltRounds
    );
    };

    export const compararPassword = async (
    passwordPlano,
    passwordHash
    ) => {
    return await bcrypt.compare(
        passwordPlano,
        passwordHash
    );
};