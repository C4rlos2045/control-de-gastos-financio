    import dotenv from 'dotenv';

    dotenv.config();

    export const env = {
    port: process.env.PORT || 3000,

    nodeEnv: process.env.NODE_ENV || 'development',

    frontendUrl:
        process.env.FRONTEND_URL || 'http://localhost:5173',

    supabaseUrl: process.env.SUPABASE_URL,

    supabaseServiceRoleKey:
        process.env.SUPABASE_SERVICE_ROLE_KEY,

    jwtSecret: process.env.JWT_SECRET,

    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',

    bcryptSaltRounds: Number(
        process.env.BCRYPT_SALT_ROUNDS || 10
    ),

    avatarBucket:
        process.env.AVATAR_BUCKET || 'avatars',

        avatarMaxSizeMb: Number(
        process.env.AVATAR_MAX_SIZE_MB || 2
        )
    };

    export const validarVariablesEntorno = () => {
    const variablesRequeridas = [
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
        'JWT_SECRET'
    ];

    const variablesFaltantes =
        variablesRequeridas.filter(
        (variable) => !process.env[variable]
        );

    if (variablesFaltantes.length > 0) {
        throw new Error(
        `Faltan variables de entorno: ${variablesFaltantes.join(', ')}`
        );
    }
    };