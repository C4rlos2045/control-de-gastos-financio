import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from './config/env.js';
import routes from './routes/indexRoutes.js';

import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { limitadorGeneral } from './middlewares/rateLimitMiddleware.js';

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: env.frontendUrl,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })
);
app.use(express.json({limit: '1mb'}));
app.use(limitadorGeneral);

app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;